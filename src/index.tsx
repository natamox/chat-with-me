/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createRoot } from 'react-dom/client';
import adapter from 'webrtc-adapter';
import './index.css';
import { STORES } from '@stores';
import 'virtual:svg-icons-register';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';
import Root from './root';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
adapter.browserDetails.browser;
const container = document.getElementById('root');
const root = createRoot(container!);

window._STORES = STORES;

root.render(
  <ConfigProvider locale={zhCN}>
    <Root />
  </ConfigProvider>,
);
