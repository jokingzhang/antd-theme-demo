import Home from './pages/Home';
import Component from './pages/Component';
import Theme from './pages/Theme/Preview';

// demos
import { Descriptions, Table, EmptyLine, Switch, Card } from 'demos';

export interface IRouteSubProps {
  key: string;
  title: string;
  path: string;
  icon?: string;
  exact?: boolean;
  component: React.ComponentType<any>;
}

export interface IRouteCfgProps {
  key: string;
  title: string;
  path: string;
  icon?: string;
  exact?: boolean;
  component: React.ComponentType<any>;
  inMenu?: boolean;
  hide?: boolean;
  routes?: Array<IRouteSubProps>;
}
// 期望，这部分可以自动生成
export const routeMap = {
  '/': 'home',
  '/theme': 'theme',
  '/comp/descriptions': 'descriptions',
  '/comp/empty-line': 'empty-line',
  '/comp/table': 'table',
  '/comp/card': 'card',
  '/comp/switch': 'switch',
} as any;

export const routeCfg: IRouteCfgProps[] = [
  {
    key: 'home',
    icon: 'home',
    title: 'menu.home',
    exact: true,
    component: Home,
    inMenu: true,
    path: '/',
  },
  {
    key: 'theme',
    icon: 'skin',
    title: 'menu.theme',
    exact: true,
    component: Theme,
    inMenu: true,
    path: '/theme',
  },
  {
    key: 'comp',
    icon: 'gold',
    title: 'menu.comp',
    inMenu: true,
    component: Component,
    path: '/comp',
    routes: [
      {
        key: 'descriptions',
        title: 'menu.comp.descriptions',
        component: Descriptions,
        path: '/comp/descriptions',
      },
      {
        key: 'empty-line',
        title: 'menu.comp.emptyLine',
        component: EmptyLine,
        path: '/comp/empty-line',
      },
      {
        key: 'table',
        title: 'menu.comp.table',
        component: Table,
        path: '/comp/table',
      },
      {
        key: 'switch',
        title: 'menu.comp.switch',
        component: Switch,
        path: '/comp/switch',
      },
      {
        key: 'card',
        title: 'menu.comp.Card',
        component: Card,
        path: '/comp/card',
      },
    ],
  },
];

export const initThemeValue = {
  '@primary-color': '#2070FE',
};
