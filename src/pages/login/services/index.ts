import { authStore } from '@stores';
import { $http } from '@utils/http';

export interface ILoginParams {
  username: string;
  password: string;
}

interface ILoginResponse {
  token: string;
  user: Pick<ILoginParams, 'username'>;
}

export const login = async (params: ILoginParams) => {
  const res = (await $http.post<ILoginResponse>('user/login', params)).data;
  authStore.setToken(res.token);
  authStore.setUsername(res.user.username);
};
