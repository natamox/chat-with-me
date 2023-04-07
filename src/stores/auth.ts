import { makeAutoObservable } from 'mobx';

import { $storage } from '@utils';
import { IUser } from '@model';

class AuthStore {
  // avatar = '/images/avatar.svg';

  user = $storage.user;

  token = $storage.token;

  constructor() {
    makeAutoObservable(this);
  }

  // setUsername(username: string) {
  //   this.username = username;
  //   $storage.username = username;
  // }
  setUserInfo(user: Omit<IUser, 'socketId'>) {
    this.user = user;
    $storage.user = user;
  }

  setToken(token: string) {
    this.token = token;
    $storage.token = token;
  }

  clear = () => {
    this.setToken('');
    this.setUserInfo({ id: '', username: '' });
  };
}

export const authStore = new AuthStore();
