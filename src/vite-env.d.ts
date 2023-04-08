/// <reference types="vite/client" />
type ISafeAny = any;

interface ImportMeta {
  readonly env: {
    VITE_SERVER_HOST: string;
  };
}

interface Window {
  _STORES: ISafeAny;
}

interface IResponse<T> {
  status: number;
  code: string;
  data: T;
  message: string;
}

interface IResponseList<T> {
  status: number;
  code: string;
  data: {
    items: T[];
    total: number;
  };
  message: string;
}
