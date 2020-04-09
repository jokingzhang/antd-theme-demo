import React, { useCallback, useRef, useMemo, useReducer, useState, useEffect } from 'react';
import { Table, Input, Icon, Row, Col, Button } from 'antd';
import classNames from 'classnames';
import Highlighter from 'react-highlight-words';
import _ from 'lodash';
import { useDebounce } from '../hooks';
import { TableProps, ColumnProps } from 'antd/lib/table';
import {
  pageSizeOptions,
  paginationLocale,
  sorterNames,
  TSorterNames,
  locale,
  showTotal,
} from './config';

// 过滤，搜索不可以同时使用

export interface ITableColumnProps<T> extends ColumnProps<T> {
  commonFilter?: boolean; // 使用组件提供的过滤
  commonSorter?: boolean; // 使用组件提供的排序
  commonSearch?: boolean; // 使用组件提供的搜索
  searchRender?: (
    value: React.ReactText,
    row: T,
    index: number,
    highlightNode: React.ReactNode,
  ) => React.ReactNode; // （commonSearch 未开启时，无效）search 功能可以高亮被搜索的信息，但是会覆盖 render 方法。如果你希望保持search的所有功能，并自定义 render 方法，请使用 searchRender 代替。
}

interface IBasicTableProps<T> extends TableProps<T> {
  dataSource: T[];
  columns: ITableColumnProps<T>[];
  loading?: boolean;
  tableTitle?: string;
  onReload?: () => void;
  showReloadBtn?: boolean;
  showFilter?: boolean;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
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
interface IColumnsReducerState {
  [x: string]: IColumnsReducerValue;
}

type TColumnsReducerAction =
  | {
      type: 'update';
      dataIndex: string | number;
      value?: any;
      updateType?: TActionName;
    }
  | { type: 'clear'; initialState: any };

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

// 泛型函数组件 https://juejin.im/post/5cd7f2c4e51d453a7d63b715#heading-7
function BasicTable<T>(props: IBasicTableProps<T>) {
  const prefixCls = `${props.prefixCls || 'dantd'}-table`;
  const filterType = props.filterType || 'half';
  const tmpDataSource = props.dataSource || ([] as T[]);
  const [dataSource, setDataSource] = useState(tmpDataSource);
  const { showFilter = true, showSearch = true, showReloadBtn = true, loading = false } = props;
  const searchPlaceholder =
    props.searchPlaceholder || '模糊搜索表格内容(多个关键词请用空格分隔。如：key1 key2)';
  const tableClassName = classNames(prefixCls, props.className);
  const filterSearchInputRef = useRef({}) as any;
  const clearFiltersRef = useRef({}) as any;
  const [searchQuery, setSearchQuery] = useState('');
  const [showRightHeader, setShowRightHeader] = useState<boolean>(false);
  const [sorterState, sorterDispatch] = useReducer(sorterReducer, {});

  const columnsDataIndexArr = props.columns.map(columnItem => columnItem.dataIndex) || [];
  const dataSourceMap = useMemo(() => {
    if (!props.dataSource || !Array.isArray(props.dataSource)) {
      return [];
    }
    return props.dataSource.reduce((acc, curVal, curIdx) => {
      let curTarget = '';

      Object.entries(curVal).forEach(([curKey, curItem]) => {
        if (
          columnsDataIndexArr.indexOf(curKey) >= 0 &&
          (typeof curItem === 'string' || typeof curItem === 'number')
        ) {
          curTarget = `${curTarget} ${curItem}`;
        }
      });

      return {
        ...acc,
        [curIdx]: curTarget.toLowerCase(),
      };
    }, {});
  }, [columnsDataIndexArr, props.dataSource]);

  const columnsMap = useMemo(() => {
    const result = {} as any;
    if (props.columns && props.columns.length > 0) {
      props.columns.forEach(columnItem => {
        if (columnItem.dataIndex) {
          result[columnItem.dataIndex as string] = {
            title: columnItem.title,
            dataIndex: columnItem.dataIndex,
            value: null,
            commonSearch: columnItem.commonSearch,
            commonFilter: columnItem.commonFilter,
            commonSorter: columnItem.commonSorter,
          };
        }
      });
    }
    return result;
  }, [props.columns]);

  const [columnsState, columnsDispatch] = useReducer(columnsReducer, columnsMap);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
      if (props.onSearch) {
        // 使用用户自定义的search回调
        props.onSearch(debouncedSearchQuery.trim());
        return;
      } else {
        // 使用组件默认的search回调

        const debouncedSearchArr = debouncedSearchQuery
          .trim()
          .toLowerCase()
          .split(' ');
        const newDataSource = tmpDataSource.filter((fiterItem, filterIdx) => {
          const filterStr = dataSourceMap[filterIdx];
          return debouncedSearchArr.every(someItem => filterStr.indexOf(someItem) >= 0);
        });

        setDataSource(newDataSource);
      }
    } else {
      setDataSource(tmpDataSource);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, props.dataSource]);

  const handleChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    sorterDispatch({
      type: 'update',
      value: sorter,
    });

    Object.entries(filters).forEach(([filterKey, filterValue]) => {
      if (columnsMap[filterKey].commonFilter) {
        columnsDispatch({
          type: 'update',
          dataIndex: filterKey,
          updateType: 'filter',
          value: filterValue,
        });
      }
    });

    checkRightHeader(filters, sorter);

    if (props.onChange) {
      props.onChange(pagination, filters, sorter, extra);
    }
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

  const handleClearAll = () => {
    sorterDispatch({ type: 'clear' });
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

  const renderColumns = useCallback(() => {
    // if (!dataSource || (dataSource && dataSource.length === 0)) {
    //   return props.columns;
    // }

    return props.columns.map(columnItem => {
      const currentItem = _.cloneDeep(columnItem);

      // filter
      if (currentItem.commonFilter && !currentItem.filters) {
        const filters = _.uniq(_.map(dataSource, columnItem.dataIndex));
        currentItem.filters = filters.map((value: string) => {
          return {
            text: value,
            value,
          };
        });
        currentItem.filterIcon = (filtered: any) => (
          <Icon data-testid="icon-filter" type="filter" />
        );
        currentItem.filteredValue = columnsState[columnItem.dataIndex as string].value;
        currentItem.onFilter = (value, record: any) => {
          if (currentItem.dataIndex && record[currentItem.dataIndex]) {
            return record[currentItem.dataIndex] === value;
          }

          return false;
        };
      }

      // sort
      if (currentItem.commonSorter) {
        currentItem.sorter = (aItem: any, bItem: any) => {
          const a = aItem[currentItem.dataIndex as string];
          const b = bItem[currentItem.dataIndex as string];
          // number
          const numA = Number(a);
          const numB = Number(b);
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }

          // date
          const dateA = +new Date(a);
          const dateB = +new Date(b);
          if (!isNaN(dateA) && !isNaN(dateB)) {
            return dateA - dateB;
          }

          // string
          if (typeof a === 'string' && typeof b === 'string') {
            return a > b ? 1 : -1;
          }

          return 0;
        };
        currentItem.sortOrder =
          sorterState.columnKey === currentItem.dataIndex && sorterState.order;
      }

      // Search
      if (currentItem.commonSearch) {
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
  }, [
    dataSource,
    props.columns,
    columnsState,
    sorterState.columnKey,
    sorterState.order,
    filterSearchInputRef,
    clearFiltersRef,
    handleFilterSearch,
    handleFilterSearchReset,
  ]);

  const isSearch = Object.values(columnsState).some((columnItem: any) => {
    return !!(columnItem.type === 'search' && columnItem.value);
  });

  const isFilter = Object.values(columnsState).some((columnItem: any) => {
    return !!(columnItem.type === 'filter' && columnItem.value && columnItem.value.length > 0);
  });

  const handleReload = () => {
    if (props.onReload) {
      props.onReload();
    }
  };

  // const handleSearchClick = value => {
  //   console.info('handleSearchClick==>', value);
  // };

  const handleSearchChange = e => {
    // console.info('handleSearchChange==>', e.target.value);
    const query = e.target.value;
    setSearchQuery(query);
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
              display: 'inline-block',
              marginTop: 3,
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
        data-testid="search-input"
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
      <Row type="flex" className={`${prefixCls}-header-search`}>
        {showSearch ? renderSearch() : <div></div>}
        {showReloadBtn && (
          <Icon
            data-testid="reload-btn"
            onClick={handleReload}
            spin={loading}
            className={`${prefixCls}-header-search-loadbtn`}
            type="reload"
          />
        )}
      </Row>
      {props.customHeader && (
        <div data-testid="custom-header" className={`${prefixCls}-header-custom`}>
          {props.customHeader}
        </div>
      )}
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
            onChange={handleChange}
            locale={{
              ...locale,
            }}
            pagination={{
              size: 'small',
              showTotal: showTotal,
              showSizeChanger: true,
              pageSizeOptions: pageSizeOptions,
              locale: paginationLocale,
            }}
            {...props.antProps}
          />
        </div>
      </Row>
    </div>
  );
}

export default BasicTable;
