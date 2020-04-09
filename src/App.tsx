import React, { useState, useEffect } from 'react';
import { Modal, Layout, Menu, Icon, message, ConfigProvider } from 'antd';
// import { Switch, Route, withRouter, NavLink, RouteProps } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { Switch, Route, withRouter, NavLink, RouteProps } from 'react-router-dom';
import { Switch as DantdSwitch } from '@didi/dantd';
import _ from 'lodash';
import NotFound from 'pages/NotFound';
import antdZhCN from 'antd/es/locale/zh_CN';
import antdEnUS from 'antd/es/locale/en_US';
import { intlZhCN, intlEnUS } from './i18n';
import { routeCfg, routeMap, IRouteCfgProps, initThemeValue } from './config';
import ThemeModalBody from 'pages/Theme/ThemeModal';
import './style.less';
import logo from 'assets/logo.png';
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

interface LocaleMap {
  [index: string]: any;
}

const localeMap: LocaleMap = {
  'zh-CN': {
    antd: antdZhCN,
    intl: 'zh-CN',
    intlMessages: intlZhCN,
  },
  'en-US': {
    antd: antdEnUS,
    intl: 'en-US',
    intlMessages: intlEnUS,
  },
};

export function RouteWithSubRoutes(route: IRouteCfgProps) {
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}

const App: React.FC = (props: RouteProps) => {
  // 中文：zh-CN
  // 英文：en-US
  const lang = window.localStorage.getItem('language') || navigator.language;
  const [language, setLanguage] = useState(lang);
  const intlMessages = _.get(localeMap[language], 'intlMessages', intlZhCN);
  // const intl = useIntl();
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setMenuActive] = useState('home');
  const initVars = Object.assign(
    {},
    initThemeValue,
    JSON.parse(localStorage.getItem('app-theme') || '{}'),
  );
  const [themeVars, setThemeVars] = useState(initVars);
  const [fieldThemeValue, setFieldThemeValue] = useState(initVars);

  const [themeVisibility, setThemeVisibility] = useState(false);

  useEffect(() => {
    window.less
      .modifyVars(themeVars)
      .then(() => {})
      .catch(() => {
        message.error(`Failed to update theme`);
      });
  }, [themeVars]);

  useEffect(() => {
    if (props.location && props.location.pathname) {
      setMenuActive(routeMap[props.location.pathname] || 'home');
    }
  }, [props.location]);

  function toggle() {
    setCollapsed(!collapsed);
  }

  function handleThemeOpen() {
    setThemeVisibility(true);
  }

  function handleThemeChange(params: string) {
    setFieldThemeValue({
      '@primary-color': params,
    });
  }

  function handleThemeOk() {
    setThemeVars(fieldThemeValue);
    const vars = {
      ...fieldThemeValue,
    };
    // console.info(vars, window.less);
    window.less
      .modifyVars(vars)
      .then(() => {
        // message.success(`Theme updated successfully`);

        localStorage.setItem('app-theme', JSON.stringify(vars));
      })
      .catch(() => {
        message.error(`Failed to update theme`);
      });

    setThemeVisibility(false);
  }

  function handleThemeCancel() {
    setFieldThemeValue(themeVars);
    setThemeVisibility(false);
  }

  function handleI18nChange(checked) {
    const newLang = checked ? 'en-US' : 'zh-CN';
    window.localStorage.setItem('language', newLang);
    setLanguage(newLang);
  }

  return (
    <div className="app">
      <IntlProvider messages={intlMessages} locale={language} defaultLocale="zh-CN">
        <ConfigProvider locale={_.get(localeMap[language], 'antd', antdZhCN)}>
          <Layout>
            <Sider theme="light" width="236" trigger={null} collapsible collapsed={collapsed}>
              <div className="logo-wrapper">
                <img src={logo} alt="UI组件库" />
                <h3> UI组件库 </h3>
              </div>
              <Menu
                className="menu"
                mode="inline"
                selectedKeys={[activeMenu]}
                defaultOpenKeys={['comp']}
              >
                {routeCfg.map(routeItem => {
                  if (routeItem.routes) {
                    return (
                      <SubMenu
                        key={routeItem.key}
                        title={
                          <span>
                            {routeItem.icon && <Icon type={routeItem.icon} />}
                            <span>{intlMessages[routeItem.title]}</span>
                          </span>
                        }
                      >
                        {routeItem.routes.map(subItem => {
                          return (
                            <Menu.Item key={subItem.key}>
                              <NavLink to={subItem.path}>
                                {subItem.icon && <Icon type={subItem.icon} />}
                                <span>{intlMessages[subItem.title]}</span>
                              </NavLink>
                            </Menu.Item>
                          );
                        })}
                      </SubMenu>
                    );
                  } else if (routeItem.component) {
                    return (
                      <Menu.Item key={routeItem.key}>
                        <NavLink to={routeItem.path}>
                          {routeItem.icon && <Icon type={routeItem.icon} />}
                          <span>{intlMessages[routeItem.title]}</span>
                        </NavLink>
                      </Menu.Item>
                    );
                  }
                  return null;
                })}
              </Menu>
            </Sider>
            <Layout>
              <Header className="app-header">
                <DantdSwitch
                  size="small"
                  className="icon-trigger"
                  checked={!collapsed}
                  onClick={toggle}
                />
                <Icon className="icon-theme" type="setting" onClick={handleThemeOpen} />
                <DantdSwitch
                  className="icon-i18n"
                  checked={language === 'en-US'}
                  onChange={handleI18nChange}
                  checkedChildren="EN"
                  unCheckedChildren="中"
                />
              </Header>
              <Content className="app-content">
                <Switch>
                  {routeCfg.map(route => (
                    <RouteWithSubRoutes key={route.key} {...route} />
                  ))}
                  <Route component={NotFound} />
                </Switch>
              </Content>
            </Layout>
          </Layout>
          <Modal
            title={intlMessages['modal.theme.title']}
            visible={themeVisibility}
            onOk={handleThemeOk}
            onCancel={handleThemeCancel}
          >
            <ThemeModalBody onChange={handleThemeChange} theme={themeVars['@primary-color']} />
          </Modal>
        </ConfigProvider>
      </IntlProvider>
    </div>
  );
};

export default withRouter(App);
