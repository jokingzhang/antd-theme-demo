import React from 'react';
import { create, act } from 'react-test-renderer';
import Numcards from '../numCards';

const data1 = [
  {
    title: 'SLA2',
    content: '31.84%31.84%31.84%31.84%31.84%',
  },
  {
    title: 'SLA3',
    content: '31.84%31.84%31.84%31.84%31.84%',
  },
  {
    title: 'SLA4',
    content: '31.84%31.84%31.84%31.84%31.84%',
  },
  {
    title: 'SLA5',
    content: '31.84%',
  },
];
const data2 = [
  {
    title: 'dataSLA2',
    content: '31.84%31.84%31.84%31.84%31.84%',
  },
  {
    title: 'dataSLA3',
    content: '61.84%',
  },
  {
    title: 'dataSLA4',
    content: '81.84%',
  },
  {
    title: 'dataSLA5',
    content: '91.84%',
  },
];
const data3 = [
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
test('基础列表渲染正常', () => {
  let comp: any;

  act(() => {
    comp = create(<Numcards dataSource={data1} />);
  });

  expect(comp.toJSON()?.children.length).toEqual(data1.length);
});
test('百分数变色列表渲染正常', () => {
  let comp: any;

  act(() => {
    comp = create(<Numcards dataSource={data2} />);
  });

  expect(comp.toJSON()?.children.length).toEqual(data2.length);
});
test('复杂列表渲染正常', () => {
  let comp: any;

  act(() => {
    comp = create(<Numcards dataSource={data3} />);
  });

  expect(comp.toJSON()?.children.length).toEqual(data3.length);
});

test('空数据渲染正常', () => {
  let comp: any;

  act(() => {
    comp = create(<Numcards dataSource={[]} />);
  });

  expect(comp.toJSON()?.children).toEqual(['- -']);
});
