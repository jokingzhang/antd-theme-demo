import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

export type CardStatus = 'success' | 'error' | 'info' | 'default' | 'warning' | string;
export type ContentStatus = CardStatus;
export type CardSize = 'number' | 'grade';

export interface ICardItem {
  title: string;
  content: string | number;
  percentNum?: string | number;
  fractional?: string | number;
  bottomContent?: any;
  color?: string;
  backgroundColor?: string;
  cardStatus?: CardStatus;
  contentStatus?: ContentStatus;
}

export interface ICardsProps {
  prefixCls?: string;
  className?: string;
  size?: CardSize;
  style?: React.CSSProperties;
  dataSource: ICardItem[];
}

const NumCards: React.FC<ICardsProps> = props => {
  const prefixCls = `${props.prefixCls || 'dantd'}-num-cards`;
  const numCardsClassName = classNames(
    prefixCls,
    {
      [`${prefixCls}-grade`]: props.size === 'grade',
      [`${prefixCls}-default`]: props.size !== 'grade',
    },
    props.className,
  );
  const numData: ICardItem[] = [];
  _.forEach(props.dataSource, (value, key) => {
    let color: string = '#333333';
    if (value.color) {
      color = value.color;
    }
    if (value.contentStatus) {
      color = value.contentStatus;
    }
    let backgroundColor: string = 'default';
    if (value.cardStatus) {
      backgroundColor = value.cardStatus;
    }
    value = {
      backgroundColor,
      color,
      ...value,
    };
    numData.push(value);
  });

  return (
    <div className={numCardsClassName} style={props.style}>
      {numData.length === 0 && '- -'}
      {numData.map(dataItem => {
        if (props.size === 'grade') {
          return (
            <div
              key={`${prefixCls}-${dataItem.title}`}
              className={`${prefixCls}-grade-item item-theme-${dataItem.cardStatus || 'default'}`}
              style={{ backgroundColor: `${dataItem.backgroundColor}` }}
            >
              <div className={`${prefixCls}-grade-item-percent`}>
                <div className={`${prefixCls}-grade-item-percent-percentNum`}>
                  {dataItem.percentNum}分
                </div>
              </div>
              <div className={`${prefixCls}-grade-item-centre`}>
                <div className={`${prefixCls}-grade-item-centre-title`}>{dataItem.title}</div>
                <div className={`${prefixCls}-grade-item-centre-content`}>{dataItem.content}</div>
              </div>
            </div>
          );
        }

        return (
          <div
            key={`${prefixCls}-${dataItem.title}`}
            className={`${prefixCls}-default-item item-theme-${dataItem.cardStatus || 'default'}`}
            style={{ backgroundColor: `${dataItem.backgroundColor}` }}
          >
            <div className={`${prefixCls}-default-item-title`}>{dataItem.title}</div>
            <div className={`${prefixCls}-default-item-centre`}>
              <div
                className={`${prefixCls}-default-item-centre-content item-theme-text-${dataItem.contentStatus ||
                  'default'}`}
                style={{ color: `${dataItem.color}` }}
              >
                {dataItem.content}
              </div>
              {dataItem.fractional && (
                <div className={`${prefixCls}-default-item-centre-fractional`}>
                  {dataItem.fractional}
                </div>
              )}
            </div>
            {dataItem.bottomContent && (
              <div className={`${prefixCls}-default-item-bottomContent`}>
                {dataItem.bottomContent}
              </div>
            )}
            {dataItem.cardStatus && dataItem.cardStatus !== 'default' && (
              <span className={`${prefixCls}-default-item-span`}>
                <span className={`${prefixCls}-default-item-span-top`}></span>
                <span className={`${prefixCls}-default-item-span-bottom`}></span>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NumCards;
