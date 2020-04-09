/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { EmptyLine } from 'components';
import { Switch } from 'antd-v3-simple-switch';
import './style.less';

const demo = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [i18nState, setI18nState] = useState(true);

  const handleI18nChange = value => {
    setI18nState(value);
  };

  return (
    <div>
      <div className="p-switch-wrapper">
        <Switch size="small" />
      </div>
      <EmptyLine />
      <div className="p-switch-wrapper">
        <Switch checkedChildren="中" unCheckedChildren="EN" />
      </div>

      <EmptyLine />
      <div className="p-switch-wrapper">
        <Switch
          checked={i18nState}
          onChange={handleI18nChange}
          checkedChildren="中"
          unCheckedChildren="EN"
        />
      </div>
      <EmptyLine />
      <div className="p-switch-wrapper">
        <Switch disabled={true} size="small" />
      </div>
      <EmptyLine />
      <div className="p-switch-wrapper">
        <Switch disabled={true} checkedChildren="中" unCheckedChildren="EN" />
      </div>
      <EmptyLine />
    </div>
  );
};

export default demo;
