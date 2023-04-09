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
  Offer = 'offer',
  Answer = 'answer',
  Ice = 'ice',

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
  socketId: string;
}

export interface IRoom {
  roomId: string;
  roomName: string;
  users: { [key: string]: IUser };
}

export interface IRoomUpdateData {
  room: IRoom;
  user: IUser;
}

export interface ISignalData {
  signal: SignalData;
  user: IUser;
}
