import React from 'react';
import { Row, Col, Card } from 'antd';
import { Descriptions } from 'components';

export const data1 = [
  {
    title: '【番剧推荐】为寻你，吾宁赴深渊——《龙的牙医》',
    content: '呐，龙是用牙齿哭泣的啊——《龙的牙医》',
  },
  {
    title: '《紫罗兰永恒花园外传：永远与自动手记人偶》值得看吗？',
    content:
      '《紫罗兰永恒花园外传：永远与自动手记人偶》已于1月10日登录国内影院。考虑到影片国内刚刚上映没几天，本篇推荐并不会涉及太多剧情上的...',
  },
];
export const data2 = [
  {
    title: '82年生的金智英 / 82年生金智英 / Kim Ji-young,Born 1982',
    content: ['2019-10-23(韩国)', '2019-11-07(中国香港)', '郑有美', '孔侑', '金美京'],
  },
  {
    title: '	小丑 / 小丑起源电影：罗密欧 / Romeo',
    content: [
      '2019-08-31(威尼斯电影节)',
      '2019-10-04(美国)',
      '华金·菲尼克斯',
      '罗伯特·德尼罗',
      '马克·马龙',
    ],
  },
];

const demo = () => {
  return (
    <div>
      <h3>组件名称：信息（Descriptions）</h3>
      <p>自定义组件，用于展示一个简单的信息列表</p>
      <Row gutter={24}>
        <Col span={12}>
          <Card title={'番剧'}>
            <Descriptions title="番剧推荐" dataSource={data1} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={'电影'}>
            <Descriptions dataSource={data2} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default demo;
