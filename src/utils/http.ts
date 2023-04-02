import { $storage } from '@utils';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { message as antdMessage } from 'antd';
import { cloneDeep, get, isString, toNumber } from 'lodash';

const BASE_URL = 'http://127.0.0.1:4399';

function createHttp() {
  const client = axios.create({
    timeout: 1000 * 60 * 10,
    headers: {},
  });

  client.interceptors.request.use((config: ISafeAny) => {
    const conf = cloneDeep(config);
    conf.url = `${BASE_URL}/api/${conf.url}`;
    const { token } = $storage;
    if (token) {
      conf.headers = {
        ...conf.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return conf;
  });

  client.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError) => {
      const errCode = get(error, 'code');
      const message = get(error, 'response.data.message', '');
      if (errCode === 'ERR_NETWORK') antdMessage.error('服务器繁忙，请稍后再试！');
      if (toNumber(errCode) === 401) {
        window._STORES.authStore.clear();
        return;
      }
      if (message && isString(message)) {
        antdMessage.error(message);
      }
      // eslint-disable-next-line consistent-return
      return Promise.reject(error);
    },
  );

  return client;
}

const $http = createHttp();

export { $http };
