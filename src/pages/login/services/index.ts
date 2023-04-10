import { IUser } from '@model';
import { authStore } from '@stores';
import { $http } from '@utils/http';

export interface ILoginParams {
  username: string;
  password: string;
}

interface ILoginResponse {
  token: string;
  user: IUser;
}

export const login = async (params: ILoginParams) => {
  const res = (await $http.post<IResponse<ILoginResponse>>('user/login', params)).data.data;
  authStore.setToken(res.token);
  authStore.setUserInfo(res.user);
};

export const register = async (params: ILoginParams & { nickname: string }) =>
  (await $http.post<IResponse<ILoginResponse>>('user/register', params)).data.data;
