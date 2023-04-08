import { IUser } from '@model';

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

  set user(data: Omit<IUser, 'socketId'>) {
    setItem('user', {
      id: data.id,
      username: data.username,
    });
  },
  get user() {
    return getItem('user') as IUser;
  },

  clear() {
    removeItem('token');
    removeItem('username');
  },
};
export { $storage };
