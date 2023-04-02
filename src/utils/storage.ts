import { isNil } from 'lodash';

function formatKey(key: string) {
  return `rtc_chat_${key}`.toUpperCase();
}

function getItem(key: string) {
  const str = localStorage.getItem(formatKey(key)) as string;
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

function removeItem(key: string) {
  localStorage.removeItem(formatKey(key));
}

function setItem(key: string, data: ISafeAny) {
  localStorage.setItem(formatKey(key), JSON.stringify(data));
}

const $storage = {
  get token() {
    return getItem('token') || '';
  },
  set token(data: string) {
    setItem('token', data);
  },
  get username() {
    return getItem('username') || '';
  },
  set username(data: string) {
    setItem('username', data);
  },
  clear() {
    removeItem('token');
    removeItem('username');
  },
};
export { $storage };
