// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ISafeAny = any;

declare module '*.svg' {
  const content: ISafeAny;
  export = content;
}

declare module '*.module.less' {
  const resource: { [key: string]: string };
  export = resource;
}

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';

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
