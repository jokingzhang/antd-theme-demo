import React, { useCallback, useRef, useMemo, useReducer, useState, useEffect } from 'react';
import { Table, Input, Icon, Row, Col, Button } from 'antd';
import queryString from 'query-string';
import classNames from 'classnames';
import Highlighter from 'react-highlight-words';
import _ from 'lodash';
import { useDebounce } from '../hooks';
import { TableProps, ColumnProps } from 'antd/lib/table';
import { PaginationProps } from 'antd/lib/pagination';
import {
  pageSizeOptions,
  paginationLocale,
  sorterNames,
  TSorterNames,
  locale,
  showTotal,
} from './config';

export interface ITableColumnProps<T> extends ColumnProps<T> {
  apiFilter?: {
    name: string;
    callback: (data: string[]) => string;
  }; // 使用组件提供的过滤
  apiSorter?: {
    name: string;
    ascend?: string; // 升序
    descend?: string; // 降序
  }; // 使用组件提供的排序
  apiSearch?: {
    name: string;
  }; // 使用组件提供的搜索
  searchRender?: (
    value: React.ReactText,
    row: T,
    index: number,
    highlightNode: React.ReactNode,
  ) => React.ReactNode; // （apiSearch 未开启时，无效）search 功能可以高亮被搜索的信息，但是会覆盖 render 方法。如果你希望保持search的所有功能，并自定义 render 方法，请使用 searchRender 代替。
}

interface IPageParamsProps extends PaginationProps {
  curPageName: string; // api curPage 的名称
  pageSizeName: string; // api pageSize 的名称
  startPage?: 0 | 1 | number; // api 开始页码 默认1 (后端参数)
}

interface ISearchParamsProps {
  apiName: string;
  placeholder?: string;
}

interface IDataTableProps<T> extends TableProps<T> {
  tableTitle?: string;
  columns: ITableColumnProps<T>[];
  url: string;
  fetchOptions?: any; // 跨域等配置 https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
  apiCallback?: (data: any) => any; // 处理 api 返回的数据
  onSearch?: (data: string) => any; // search回调
  customQueryCallback?: (data: any) => any; // 自定义查询参数
  pageParams: IPageParamsProps;
  searchParams?: ISearchParamsProps; // 需要api Search，就要定义此参数
  showReloadBtn?: boolean;
  showFilter?: boolean;
  filterType?: 'line' | 'half' | string;
  leftHeader?: React.ReactNode | string | number;
  customHeader?: React.ReactNode | string | number;
  antProps?: TableProps<T>;
}

type TActionName = 'search' | 'filter';

interface IColumnsReducerValue {
  title: string;
  dataIndex: string;
  type?: TActionName;
  value?: any;
}

type TColumnsReducerAction =
  | {
      type: 'update';
      dataIndex: string | number;
      value?: any;
      updateType?: TActionName;
    }
  | { type: 'clear'; initialState: any };

interface IColumnsReducerState {
  [x: string]: IColumnsReducerValue;
}

type TSorterReducerAction = { type: 'update'; value: any } | { type: 'clear' };

function columnsReducer(state: IColumnsReducerState, action: TColumnsReducerAction) {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        [action.dataIndex]: {
          ...state[action.dataIndex],
          dataIndex: action.dataIndex,
          type: action.updateType,
          value: action.value,
        },
      };
    case 'clear':
      return {
        ...action.initialState,
      };
    default:
      return state;
  }
}

function sorterReducer(state: any, action: TSorterReducerAction) {
  switch (action.type) {
    case 'update':
      return {
        ...action.value,
      };
    case 'clear':
      return {};
    default:
      return state;
  }
}

function DataTable<T>(props: IDataTableProps<T>) {
  const prefixCls = `${props.prefixCls || 'dantd'}-data-table`;
  const filterType = props.filterType || 'half';
  const isUrlLoad = useRef<string>();
  const tableClassName = classNames(prefixCls, props.className);
  const columnsMap = useMemo(() => {
    const result = {} as any;
    if (props.columns && props.columns.length > 0) {
      props.columns.forEach(columnItem => {
        if (columnItem.dataIndex) {
          result[columnItem.dataIndex as string] = {
            ...columnItem,
            value: null,
          };
        }
      });
    }
    return result;
  }, [props.columns]);
  const filterSearchInputRef = useRef({}) as any;
  const clearFiltersRef = useRef({}) as any;
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorterState, sorterDispatch] = useReducer(sorterReducer, {});
  const [showRightHeader, setShowRightHeader] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState();
  const {
    fetchOptions = {},
    searchParams,
    showFilter = true,
    showReloadBtn = true,
    url,
    pageParams,
  } = props;
  const searchPlaceholder = searchParams
    ? searchParams.placeholder
    : '模糊搜索表格内容(多个关键词请用空格分隔。如：key1 key2)';
  const [paginationState, setPagination] = useState({
    size: 'small',
    showTotal: showTotal,
    showSizeChanger: true,
    pageSizeOptions: pageSizeOptions,
    locale: paginationLocale,
    current: 1,
    pageSize: 10,
    total: 0,
    ...pageParams,
  });
  const [columnsState, columnsDispatch] = useReducer(columnsReducer, columnsMap);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const pageStr = JSON.stringify({
    pageSize: paginationState.pageSize,
    current: paginationState.current,
  });
  const tableStateStr = JSON.stringify({
    ...columnsState,
    ...sorterState,
  });
  // TODO 支持监听 customQuery
  useEffect(() => {
    if (url && isUrlLoad.current !== url) {
      let fetchParams = getAllFetchParams();
      fetchData(fetchParams);

      setTimeout(() => {
        isUrlLoad.current = url;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    if (!isUrlLoad.current) {
      return;
    }
    let fetchParams = getAllFetchParams();
    fetchParams[paginationState.curPageName] = 1;
    if (searchParams && debouncedSearchQuery && debouncedSearchQuery.trim()) {
      fetchParams[searchParams.apiName] = debouncedSearchQuery.trim();
    }

    if (props.onSearch) {
      // 使用用户自定义的search回调
      props.onSearch(debouncedSearchQuery ? debouncedSearchQuery.trim() : debouncedSearchQuery);
    }

    fetchData(fetchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (!isUrlLoad.current) {
      return;
    }
    let fetchParams = getAllFetchParams();
    fetchData(fetchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableStateStr]);

  useEffect(() => {
    if (!isUrlLoad.current || !paginationState.pageSize) {
      return;
    }
    let fetchParams = getAllFetchParams();
    fetchData(fetchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageStr]);

  async function fetchData(params?: any) {
    let fetchUrl = url;

    // api起始页从0开始，参数需要减1

    let fetchParams = {
      [pageParams.curPageName]: params.current,
      [pageParams.pageSizeName]: params.pageSize,
    };
    if (pageParams.startPage === 0) {
      fetchParams[pageParams.curPageName] -= 1;
    }

    props.columns.forEach(columnItem => {
      if (columnItem.dataIndex && params[columnItem.dataIndex]) {
        fetchParams[columnItem.dataIndex] = params[columnItem.dataIndex];
      }
      if (columnItem.apiSearch && params[columnItem.apiSearch.name]) {
        fetchParams[columnItem.apiSearch.name] = params[columnItem.apiSearch.name];
      }
      if (columnItem.apiFilter && params[columnItem.apiFilter.name]) {
        fetchParams[columnItem.apiFilter.name] = params[columnItem.apiFilter.name];
      }
      if (columnItem.apiSorter && params[columnItem.apiSorter.name]) {
        fetchParams[columnItem.apiSorter.name] = params[columnItem.apiSorter.name];
      }
    });

    if (searchParams && params[searchParams.apiName]) {
      fetchParams[searchParams.apiName] = params[searchParams.apiName];
    }

    if (props.customQueryCallback) {
      fetchParams = props.customQueryCallback({
        ...fetchParams,
      });
    }

    // console.info('fetchData==>', fetchParams);

    fetchUrl = `${fetchUrl}?${queryString.stringify(fetchParams)}`;
    setLoading(true);
    const res = await fetch(fetchUrl, {
      ...fetchOptions,
    });
    res
      .json()
      .then(res => {
        let callbackData = res;
        if (props.apiCallback) {
          callbackData = props.apiCallback(res);
        }
        setDataSource(callbackData.data);
        const tmpPagination = {
          ...paginationState,
          total: callbackData.total,
        };
        setPagination(tmpPagination);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (!isUrlLoad.current) {
      return;
    }
    sorterDispatch({
      type: 'update',
      value: {
        ...sorter,
      },
    });

    Object.entries(filters).forEach(([filterKey, filterValue]) => {
      if (columnsMap[filterKey].filters) {
        columnsDispatch({
          type: 'update',
          dataIndex: filterKey,
          updateType: 'filter',
          value: filterValue,
        });
      }
    });

    setPagination(pagination);

    checkRightHeader(filters, sorter);
  };

  const handleFilterSearch = useCallback(
    (
      selectedKeys: React.ReactText[] | undefined,
      confirm: (() => void) | undefined,
      dataIndex: string | number,
    ) => {
      if (confirm) {
        confirm();
      }
      if (selectedKeys && dataIndex) {
        columnsDispatch({
          type: 'update',
          dataIndex,
          updateType: 'search',
          value: selectedKeys[0],
        });
      }
    },
    [],
  );

  const handleFilterSearchReset = useCallback(
    (
      clearFilters: ((selectedKeys: string[]) => void) | undefined,
      dataIndex: string | number | undefined,
    ) => {
      if (clearFilters) {
        clearFilters([]);
      }
      if (dataIndex) {
        columnsDispatch({
          type: 'update',
          dataIndex,
        });
      }
    },
    [],
  );

  const handleFilterClear = (columnValue: IColumnsReducerValue) => {
    columnsDispatch({
      type: 'update',
      dataIndex: columnValue.dataIndex,
      value: [],
    });

    const tmpFilters = Object.values(columnsState).map((filterItem: any) => {
      if (filterItem.dataIndex === columnValue.dataIndex) {
        return {
          [filterItem.dataIndex]: [],
        };
      }
      return {
        [filterItem.dataIndex]: filterItem.value || [],
      };
    });

    checkRightHeader(tmpFilters, sorterState, columnsState);
  };

  const handleFilterSearchClear = (columnValue: IColumnsReducerValue) => {
    columnsDispatch({
      type: 'update',
      dataIndex: columnValue.dataIndex,
    });

    if (
      clearFiltersRef.current[columnValue.dataIndex] &&
      clearFiltersRef.current[columnValue.dataIndex].clearFilters
    ) {
      clearFiltersRef.current[columnValue.dataIndex].clearFilters([]);
    }

    checkRightHeader(null, sorterState, {
      ...columnsState,
      [columnValue.dataIndex]: {
        title: columnsState[columnValue.dataIndex].title,
        dataIndex: columnsState[columnValue.dataIndex].dataIndex,
        value: null,
      },
    });
  };

  const handleClearAll = () => {
    sorterDispatch({ type: 'clear' });
    // console.info('handleClearAll==>', columnsMap, clearFiltersRef.current);
    columnsDispatch({ type: 'clear', initialState: columnsMap });

    Object.values(clearFiltersRef.current).forEach((filterItem: any) => {
      if (filterItem && filterItem.clearFilters) {
        filterItem.clearFilters([]);
      }
    });

    setShowRightHeader(false);
  };

  const handleSortClear = () => {
    sorterDispatch({ type: 'clear' });
    checkRightHeader(null, {});
  };

  const getAllFetchParams = () => {
    let fetchParams = {
      ...paginationState,
    };

    // columns sort
    if (sorterState && sorterState.order) {
      fetchParams[sorterState.column.apiSorter.name] =
        sorterState.column.apiSorter[sorterState.order];
    }

    Object.values(columnsState).forEach((column: any) => {
      const filterKey = column.dataIndex;
      const filterVal = column.value;
      // columns filter
      if (column.apiFilter && filterVal) {
        let filterName = columnsMap[filterKey].apiFilter
          ? columnsMap[filterKey].apiFilter.name
          : filterKey;
        fetchParams[filterName] = filterVal;
        if (column.apiFilter.callback) {
          fetchParams[filterName] = columnsMap[filterKey].apiFilter.callback(filterVal);
        }
      }
      // columns search
      if (column.apiSearch && filterVal) {
        const filterName = columnsMap[filterKey].apiSearch
          ? columnsMap[filterKey].apiSearch.name
          : filterKey;
        fetchParams[filterName] = filterVal && filterVal[0];
      }
    });

    // query search
    if (searchParams && searchQuery) {
      fetchParams[searchParams.apiName] = searchQuery;
    }

    return fetchParams;
  };

  const handleReload = () => {
    // pages
    let fetchParams = getAllFetchParams();
    fetchData(fetchParams);
  };

  const handleSearchChange = e => {
    const query = e.target.value;
    setSearchQuery(query);
    // 使用组件默认的search回调
    setPagination({
      ...paginationState,
      current: 1,
    });
  };

  const checkRightHeader = (filters?: any, sorter?: any, search?: any) => {
    const checkSorter = sorter || sorterState;
    const checkFilters = filters || columnsState;
    const checkSearch = search || columnsState;
    const isSearch = Object.values(checkSearch).some((columnItem: any) => {
      return !!(columnItem.type === 'search' && columnItem.value);
    });
    let isFilter = false;
    if (filters) {
      isFilter = Object.values(checkFilters).some((columnItem: any) => {
        return columnItem && columnItem.length > 0;
      });
    } else {
      isFilter = Object.values(checkFilters).some((columnItem: any) => {
        return !!(columnItem.type === 'filter' && columnItem.value && columnItem.value.length > 0);
      });
    }
    const isSorter = !!checkSorter.column;

    const res = isSearch || isFilter || isSorter;
    setShowRightHeader(res);
  };

  const isSearch = Object.values(columnsState).some((columnItem: any) => {
    return !!(columnItem.type === 'search' && columnItem.value);
  });

  const isFilter = Object.values(columnsState).some((columnItem: any) => {
    return !!(columnItem.type === 'filter' && columnItem.value && columnItem.value.length > 0);
  });

  const renderColumns = () => {
    return props.columns.map(columnItem => {
      const currentItem = _.cloneDeep(columnItem);

      // filter
      if (currentItem.apiFilter) {
        currentItem.filteredValue = columnsState[columnItem.dataIndex as string].value;
      }

      // // sort
      if (currentItem.apiSorter) {
        currentItem.sortOrder =
          sorterState.columnKey === currentItem.dataIndex && sorterState.order;
      }

      // Search
      if (currentItem.apiSearch) {
        currentItem.filterIcon = (filtered: any) => (
          <Icon data-testid="icon-search" type="search" />
        );

        currentItem.onFilterDropdownVisibleChange = (visible: boolean) => {
          if (visible && filterSearchInputRef.current && filterSearchInputRef.current.select) {
            setTimeout(() => {
              if (filterSearchInputRef.current && filterSearchInputRef.current.select) {
                filterSearchInputRef.current.select();
              }
              return null;
            });
          }
        };

        currentItem.filterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
          clearFiltersRef.current[currentItem.dataIndex as string] = {
            clearFilters,
          };

          return (
            <div style={{ padding: 8 }}>
              <Input
                data-testid="filter-search-input"
                autoFocus={true}
                ref={node => {
                  filterSearchInputRef.current = node;
                }}
                placeholder={'请输入要搜索的内容'}
                value={selectedKeys && selectedKeys[0]}
                onChange={e => {
                  if (setSelectedKeys) {
                    return setSelectedKeys(e.target.value ? [e.target.value] : []);
                  }
                  return [];
                }}
                onPressEnter={() =>
                  handleFilterSearch(selectedKeys, confirm, currentItem.dataIndex as string)
                }
                style={{ width: 188, marginBottom: 8, display: 'block' }}
              />
              <Button
                type="primary"
                onClick={() =>
                  handleFilterSearch(selectedKeys, confirm, currentItem.dataIndex as string)
                }
                icon="search"
                size="small"
                data-testid="search-btn-ok"
                style={{ width: 90, marginRight: 8 }}
              >
                搜索
              </Button>
              <Button
                onClick={() => handleFilterSearchReset(clearFilters, currentItem.dataIndex)}
                size="small"
                style={{ width: 90 }}
              >
                清空
              </Button>
            </div>
          );
        };

        let searchWords: any[] = [];

        const tmpStateValue = columnsState[currentItem.dataIndex as string].value;
        if (typeof tmpStateValue === 'string') {
          searchWords = [tmpStateValue];
        }

        if (Array.isArray(tmpStateValue) && typeof tmpStateValue[0] === 'string') {
          searchWords = [tmpStateValue[0]];
        }

        currentItem.onFilter = (value, record: any) => {
          return record[currentItem.dataIndex as string]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        };

        if (!currentItem.render) {
          currentItem.render = (value, row, index) => {
            if (currentItem.searchRender) {
              return currentItem.searchRender(
                value,
                row,
                index,
                <Highlighter
                  highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                  searchWords={searchWords}
                  autoEscape
                  textToHighlight={String(value)}
                />,
              );
            } else {
              return (
                <Highlighter
                  highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                  searchWords={searchWords}
                  autoEscape
                  textToHighlight={String(value)}
                />
              );
            }
          };
        }
      }

      return currentItem;
    });
  };

  const renderRightHeader = params => {
    if (!showFilter) {
      return null;
    }
    return (
      <>
        <div>
          <b
            style={{
              marginTop: 4,
              display: 'inline-block',
            }}
          >
            过滤条件：
          </b>
        </div>
        {(isSearch || isFilter) &&
          Object.values(columnsState as IColumnsReducerState).map(columnValue => {
            if (columnValue.type === 'search' && columnValue.value) {
              return (
                <div
                  key={`search-header-${columnValue.dataIndex}`}
                  className={`${params.headerClsPrefix}-item`}
                >
                  <Button
                    className="table-header-item-btn"
                    onClick={() => handleFilterSearchClear(columnValue)}
                  >
                    {columnValue.title}
                    {`：搜索「${columnValue.value}」`}
                    <Icon type="close" />
                  </Button>
                </div>
              );
            }

            if (
              columnValue.type === 'filter' &&
              columnValue.value &&
              columnValue.value.length > 0
            ) {
              return (
                <div
                  key={`search-header-${columnValue.dataIndex}`}
                  className={`${params.headerClsPrefix}-item`}
                >
                  <Button
                    className="table-header-item-btn"
                    onClick={() => handleFilterClear(columnValue)}
                  >
                    {columnValue.title}
                    {`：过滤「${columnValue.value.join()}」`}
                    <Icon type="close" />
                  </Button>
                </div>
              );
            }

            return null;
          })}
        {sorterState.columnKey && sorterState.column && (
          <div className={`${params.headerClsPrefix}-item`}>
            <Button className="table-header-item-btn" onClick={handleSortClear}>
              {sorterState.column.title}
              {`：${sorterNames[sorterState.order as TSorterNames]}`}
              <Icon type="close" />
            </Button>
          </div>
        )}
        <div className={`${params.headerClsPrefix}-item`}>
          <Button
            style={{ marginLeft: -10 }}
            type="link"
            data-testid="btn-clearall"
            onClick={handleClearAll}
          >
            清空
          </Button>
        </div>
      </>
    );
  };

  const renderSearch = () => {
    return (
      <Input
        allowClear={true}
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={searchPlaceholder}
        // suffix={<Icon onClick={handleSearchClick} type="search" />}
      />
    );
  };

  return (
    <div className={tableClassName} style={props.style}>
      {!!props.tableTitle && <h3> {props.tableTitle} </h3>}
      {props.customHeader && (
        <div className={`${prefixCls}-header-custom`}>{props.customHeader}</div>
      )}
      <Row type="flex" className={`${prefixCls}-header-search`}>
        {!!searchParams ? renderSearch() : <div></div>}
        {showReloadBtn && (
          <Icon
            onClick={handleReload}
            spin={loading}
            className={`${prefixCls}-header-search-loadbtn`}
            type="reload"
          />
        )}
      </Row>
      {filterType === 'line' && (
        <Row className={`${prefixCls}-header-filter`}>
          <Col data-testid="right-header" className={`${prefixCls}-header-filter-line`} span={24}>
            {showRightHeader &&
              renderRightHeader({
                headerClsPrefix: `${prefixCls}-header-filter-line`,
              })}
          </Col>
        </Row>
      )}
      {filterType === 'half' && (
        <Row className={`${prefixCls}-header-filter`}>
          <Col
            data-testid="left-header"
            className={classNames(
              `${prefixCls}-header-filter-left`,
              props.leftHeader !== undefined && `${prefixCls}-header-filter-left-minh`,
            )}
            span={12}
          >
            {props.leftHeader}
          </Col>
          <Col data-testid="right-header" className={`${prefixCls}-header-filter-right`} span={12}>
            {showRightHeader &&
              renderRightHeader({
                headerClsPrefix: `${prefixCls}-header-filter-right`,
              })}
          </Col>
        </Row>
      )}
      <Row className={`${prefixCls}-table-wrapper`}>
        <div className={`${prefixCls}-table-content`}>
          <Table
            loading={loading}
            columns={renderColumns()}
            dataSource={dataSource}
            bordered={false}
            onChange={handleTableChange}
            locale={{
              ...locale,
            }}
            pagination={paginationState}
            {...props.antProps}
          />
        </div>
      </Row>
    </div>
  );
}

export default DataTable;
