---
order: 1
title: 使用数组
---

展示一个简单的描述列表，`Descriptions.Item[]` 传入数组。

```jsx
import { Descriptions } from '@didi/dantd';

const data = [
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

ReactDOM.render(<Descriptions dataSource={data} />, mountNode);
```
