import { $http } from '@utils';

export const login = () => {
  console.log('first');
  return $http.post('user/login', {
    username: 'cxf',
    password: '123456',
  });
};

export const first = () => {
  console.log('ff');
};
