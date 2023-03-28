import axios from 'axios';

function createHttp() {
  const client = axios.create({
    timeout: 1000 * 60 * 10,
    headers: {},
  });

  client.defaults.baseURL = 'http://127.0.0.1:4399/api/';

  return client;
}

const $http = createHttp();

export default $http;
