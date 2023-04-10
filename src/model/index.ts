import { SignalData } from 'simple-peer';

export enum ESocketMessage {
  Connect = 'connect',
  Disconnect = 'disconnect',
  Leaved = 'leaved',
  Joined = 'joined',

  Join = 'join',
  Leave = 'leave',
  Create = 'create',
  Match = 'match',
  Message = 'message',

  OpenCamera = 'openCamera',
  CloseCamera = 'closeCamera',

  Signal = 'signal',
  Stream = 'stream',

  PeerRequest = 'connPre',

  PeerConn = 'connInit',

  Info = 'info',
  Warn = 'warn',
}

export interface IUser {
  id: string;
  username: string;
  nickname: string;
}

export interface IRoomUser extends IUser {
  socketId: string;
  isCameraOpen: boolean;
}

export interface IMessage {
  id: string;
  user: Omit<IUser, 'socketId'>;
  text: string;
  time: string;
}

export enum ERoomType {
  Math = 'math',
  Chat = 'chat',
}

export interface IRoom {
  roomId: string;
  roomName: string;
  type: ERoomType;
  users: { [key: string]: IRoomUser };
  message: IMessage[];
}

export interface IRoomUpdateData {
  room: IRoom;
  user: IUser;
}

export interface ISignalData {
  signal: SignalData;
  user: IUser;
}
