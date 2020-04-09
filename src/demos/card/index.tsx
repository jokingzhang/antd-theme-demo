import React from 'react';
import Card from 'components/num-cards';

export const data = [
  {
    title: 'SLA',
    content: '31.84%',
    fractional: '20/1000',
    bottomContent: '时间基数 1281268800min',
  },
  {
    title: '小丑',
    content: '3333',
    bottomContent: <div style={{ color: '#fcc' }}>color: #fcc</div>,
  },
  {
    title: 'SLA111',
    content: '31.84%',
    fractional: '20/1000',
    bottomContent: '时间基数 1281268800min',
  },
  {
    title: '小丑111',
    content: '3333',
    bottomContent: <div style={{ color: '#fcc' }}>color: #fcc</div>,
  },
  {
    title: 'SLA222',
    content: '31.84%',
    fractional: '20/1000',
    bottomContent: '时间基数 1281268800min',
  },
];
export const data2 = [
  {
    title: 'dataSLA2',
    content: '31.84%',
    contentStatus: 'error',
  },
  {
    title: 'dataSLA3',
    content: '61.84%',
    contentStatus: 'warning',
  },
  {
    title: 'dataSLA4',
    content: '81.84%',
    contentStatus: 'info',
  },
  {
    title: 'dataSLA5',
    content: '91.84%',
    contentStatus: '#fcc',
  },
  {
    title: 'dataSLA5',
    content: '91.84%',
  },
];
export const data4 = [
  {
    title: 'dataSLA22',
    content: '31.84%',
    cardStatus: 'error',
  },
  {
    title: 'dataSLA32',
    content: '61.84%',
    cardStatus: 'warning',
  },
  {
    title: 'dataSLA42',
    content: '81.84%',
    cardStatus: 'info',
  },
  {
    title: 'dataSLA52',
    content: '91.84%',
    cardStatus: 'success',
  },
  {
    title: 'preSLA62',
    content: '100',
    cardStatus: '#fcc',
  },
  {
    title: 'preSLA622',
    content: '100',
  },
];
export const data3 = [
  {
    title: 'preSLA2',
    percentNum: '0',
    cardStatus: 'error',
    content: '31.84%31.84%31.84%31.84%31.84%',
  },
  {
    title: 'preSLA3',
    percentNum: '60',
    cardStatus: 'warning',
    content: '31.84%31.84%31.84%31.84%31.84%',
  },
  {
    title: 'preSLA4',
    percentNum: '75',
    cardStatus: 'info',
    content: '31.84%31.84%31.84%31.84%31.84%',
  },
  {
    title: 'preSLA5',
    percentNum: '100',
    cardStatus: 'success',
    content: '31.84%',
  },
  {
    title: 'preSLA6',
    percentNum: '100',
    cardStatus: '#fcc',
    content: '31.84%',
  },
];
const demo = () => {
  return (
    <div>
      <h3>组件名称：卡片（Card）111</h3>
      <p>自定义组件，统计数值卡片</p>
      <Card dataSource={data} size={'number'}></Card>
      <Card dataSource={data2} size={'number'}></Card>
      <Card dataSource={data4} size={'number'}></Card>
      <p>自定义组件，百分比警告提示组件卡片</p>
      <Card dataSource={data3} size={'grade'}></Card>
    </div>
  );
};

export default demo;
