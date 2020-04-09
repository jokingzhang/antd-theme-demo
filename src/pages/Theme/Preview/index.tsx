import React from 'react';
import EmytyLine from 'components/empty-line';
import {
  Button,
  Row,
  Breadcrumb,
  Menu,
  Divider,
  Dropdown,
  Icon,
  Pagination,
  PageHeader,
  Steps,
  Checkbox,
  DatePicker,
  Input,
  Radio,
  Switch,
  Slider,
  Table,
  Tag,
  Alert,
  Progress,
  BackTop,
} from 'antd';

import './style.less';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { Step } = Steps;

const Preview = () => {
  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          3rd menu item
        </a>
      </Menu.Item>
    </Menu>
  );

  const plainOptions = ['Apple', 'Pear', 'Orange'];
  const options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' },
  ];
  const optionsWithDisabled = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange', disabled: false },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: any) => <a href="test">{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags: any) => (
        <span>
          {tags.map((tag: any) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <span>
          <a href="test">Invite {record.name}</a>
          <Divider type="vertical" />
          <a href="test">Delete</a>
        </span>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  return (
    <div className="p-preview">
      <BackTop />
      <h3>Button 按钮</h3>
      <Row>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="danger">Danger</Button>
        <Button type="link">Link</Button>
      </Row>
      <EmytyLine />
      <h3>Breadcrumb 面包屑</h3>
      <Row>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="test">Application Center</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="test">Application List</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>An Application</Breadcrumb.Item>
        </Breadcrumb>
      </Row>
      <EmytyLine />
      <h3>Dropdown 下拉菜单</h3>
      <Dropdown overlay={menu}>
        <a href="test" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
          Hover me <Icon type="down" />
        </a>
      </Dropdown>
      <EmytyLine />
      <h3>Menu 导航菜单</h3>
      <Menu selectedKeys={['mail']} mode="horizontal">
        <Menu.Item key="mail">
          <Icon type="mail" />
          Navigation One
        </Menu.Item>
        <Menu.Item key="app" disabled>
          <Icon type="appstore" />
          Navigation Two
        </Menu.Item>
      </Menu>
      <EmytyLine />
      <h3>Pagination 分页</h3>
      <Pagination defaultCurrent={1} total={50} />
      <EmytyLine />
      <h3>PageHeader 页头</h3>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        onBack={() => null}
        title="Title"
        subTitle="This is a subtitle"
      />
      <EmytyLine />
      <h3>Steps 步骤条</h3>
      <Steps current={1}>
        <Step title="Finished" description="This is a description." />
        <Step title="In Progress" subTitle="Left 00:00:08" description="This is a description." />
        <Step title="Waiting" description="This is a description." />
      </Steps>
      <EmytyLine />
      <Divider />
      <h3>Checkbox 多选框</h3>
      <Checkbox.Group options={plainOptions} defaultValue={['Apple']} />
      <br />
      <br />
      <Checkbox.Group options={options} defaultValue={['Pear']} />
      <br />
      <br />
      <Checkbox.Group options={optionsWithDisabled} disabled defaultValue={['Apple']} />
      <EmytyLine />
      <h3>DatePicker 日期选择框</h3>
      <div>
        <DatePicker />
        <EmytyLine height={10} />
        <MonthPicker placeholder="Select month" />
        <EmytyLine height={10} />
        <RangePicker />
        <EmytyLine height={10} />
        <WeekPicker placeholder="Select week" />
      </div>
      <EmytyLine />
      <h3>Input 输入框</h3>
      <Input placeholder="Basic usage" />
      <EmytyLine />
      <h3>Radio 单选框</h3>
      <Radio.Group value={2}>
        <Radio value={1}>A</Radio>
        <Radio value={2}>B</Radio>
        <Radio value={3}>C</Radio>
        <Radio value={4}>D</Radio>
      </Radio.Group>
      <EmytyLine />
      <h3>Switch 开关</h3>
      <Switch defaultChecked />
      <EmytyLine />
      <h3>Slider 滑动输入条</h3>
      <Slider defaultValue={30} />
      <EmytyLine />
      <h3>Table 表格</h3>
      <Table columns={columns} dataSource={data} />
      <EmytyLine />
      <h3>Alert 警告提示</h3>
      <Alert message="Success Text" type="success" />
      <EmytyLine height={10} />
      <Alert message="Info Text" type="info" />
      <EmytyLine height={10} />
      <Alert message="Warning Text" type="warning" />
      <EmytyLine height={10} />
      <Alert message="Error Text" type="error" />
      <EmytyLine />
      <h3>Progress 进度条</h3>
      <Progress percent={30} />
      <Progress percent={50} status="active" />
      <Progress percent={70} status="exception" />
      <Progress percent={100} />
      <Progress percent={50} showInfo={false} />
      <EmytyLine />
    </div>
  );
};

export default Preview;
