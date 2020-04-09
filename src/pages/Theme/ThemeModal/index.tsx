import React, { useState } from 'react';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { themeConf } from '../config';
import './style.less';

interface IModalProps {
  theme: string;
  onChange: (theme: string) => void;
}

const ModalBody = (props: IModalProps) => {
  const [themeColor, setThemeColor] = useState(props.theme);

  const handleThemeChange = (e: RadioChangeEvent) => {
    setThemeColor(e.target.value);
    props.onChange(e.target.value);
  };

  return (
    <div className="theme-modal-body">
      <Radio.Group onChange={handleThemeChange} value={themeColor}>
        {themeConf.map(themeItem => {
          return (
            <Radio key={`theme-${themeItem.color}`} value={themeItem.color}>
              <div className="theme-modal-radio-img-wrapper">
                <img src={themeItem.sourceImg} alt={themeItem.title} />
                <span>{themeItem.title}</span>
              </div>
            </Radio>
          );
        })}
      </Radio.Group>
    </div>
  );
};

export default ModalBody;
