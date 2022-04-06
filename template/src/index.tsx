/* eslint-disable camelcase */
/* eslint-disable no-undef */
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import App from './App';
import 'src/styles/index.less';

if (window.__POWERED_BY_QIANKUN__) {
  // @ts-ignore
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

const root = ReactDOMClient.createRoot(document.getElementById('root-slave') as Element);
// Create a root.
const render = (props: any = {}) =>
  root.render(
    <React.StrictMode>
      <App {...props} />
    </React.StrictMode>
  );

if (!(window as any).__POWERED_BY_QIANKUN__) {
  render({});
}

/**
 * lifecycles of qiankun.
 */
export async function bootstrap() {
  /**
   * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
   * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
   */
}
/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: any) {
  render(props);
}
/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props: any) {
  root.unmount();
}
