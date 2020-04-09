# dantd-demo

[预览地址](http://10.170.178.118:8080/)

`dantd` 一个基于 [Antd-v3](https://github.com/ant-design/ant-design/) 所封装的业务组件库 `dantd-demo` 一个写组件的地方

# Features

- 支持 TypeScript
- 支持 单元测试 Jest + @testing-library/react
- 支持 less
- 支持 eslint & prettier
- 支持 react-app-rewired

# Installation

```
$ npm install
```

# Usage

```
# 开发组件
$ npm start

# 组件测试
$ npm test

# 同步一个组件
$ node scripts/sync.js -c empty-line
```

# 组件

### 开发

在 `src` 目录下，新增一个组件的目录，类似上面的 `empty-line` 组件。目录名需要保持**小写**。如果是自定义组件，需要取一个 `antd` 中所不包含的组件名称。添加完文件之后，在 `entry/config.tsx` 中增加 `demo` 的配置。此时应该可以看到组件，并继续开发了。

更多请参考：[手摸手，打造属于自己的 React 组件库 —— 基础篇](http://way.xiaojukeji.com/article/20141)

### 测试

测试文件需要保持 `.test.tsx` 的后缀。相关技术栈以及文档：

- [Jest](https://jestjs.io/)：JavaScript 测试框架。
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro)：将 React 组件转化成 Dom 节点来测试，而不是渲染的 React 组件的实例，可以当做是 [Enzyme](http://airbnb.io/enzyme/) 的替代。编写测试脚本，并保证希望测试到的地方已经覆盖。

更多请参考：[手摸手，打造属于自己的 React 组件库 —— 测试篇](http://way.xiaojukeji.com/article/20144)

### 同步

会把对应文件从 `dantd-demo` 复制到 `dantd`

```
$ node scripts/sync.js -c empty-line
```
