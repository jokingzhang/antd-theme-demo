/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Tabs, Table } from 'antd';
import { BasicTable } from 'components';
import { columns, data as tableData } from './config';
const { TabPane } = Tabs;

const TableDemo = props => {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="普通Table" key="1">
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={{
              size: 'small',
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
          />
        </TabPane>
        <TabPane tab="自定义参数" key="2">
          <BasicTable showSearch={true} columns={columns} dataSource={tableData} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TableDemo;
