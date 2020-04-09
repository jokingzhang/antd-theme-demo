import React from 'react';
import classNames from 'classnames';

export interface IDescriptionItem {
  title: string;
  content: string | string[];
}

export interface IDescriptionsProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  dataSource: IDescriptionItem[];
}

const Descriptions: React.FC<IDescriptionsProps> = props => {
  const prefixCls = `${props.prefixCls || 'dantd'}-desc`;
  const descClassName = classNames(prefixCls, props.className);

  function renderEmpty(content: string | string[]) {
    if (!content || (Array.isArray(content) && content.length === 0)) {
      return '- -';
    }
    return null;
  }

  return (
    <div className={descClassName} style={props.style}>
      {props.dataSource.length === 0 && '- -'}
      {props.title && <div className={`${prefixCls}-title`}>{props.title}</div>}
      {props.dataSource.map(dataItem => {
        return (
          <div key={`${prefixCls}-${dataItem.title}`} className={`${prefixCls}-item`}>
            <div className={`${prefixCls}-item-title`}>{dataItem.title}</div>
            <div className={`${prefixCls}-item-content`}>
              {renderEmpty(dataItem.content)}
              {typeof dataItem.content === 'string'
                ? dataItem.content
                : dataItem.content.join('，')}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Descriptions;
