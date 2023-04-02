import { makeAutoObservable } from 'mobx';

import { $storage } from '@utils';

class AuthStore {
  // avatar = '/images/avatar.svg';

  username = $storage.username;

  token = $storage.token;

  constructor() {
    makeAutoObservable(this);
  }

  setUsername(username: string) {
    this.username = username;
    $storage.username = username;
  }

  setToken(token: string) {
    this.token = token;
    $storage.token = token;
  }

  clear = () => {
    this.setToken('');
    this.setUsername('');
  };
}

export const authStore = new AuthStore();
