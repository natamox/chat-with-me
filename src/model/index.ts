import { SignalData } from 'simple-peer';

export enum ESocketMessage {
  Connect = 'connect',
  Disconnect = 'disconnect',
  Joined = 'joined',
  Leaved = 'leaved',

  Join = 'join',
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
  users: IUser[];
}

export interface ISignalData {
  signal: SignalData;
  user: IUser;
}
