import { ESocketMessage, IRoom, IRoomUpdateData, ISignalData, IUser } from '@model';
import { authStore } from '@stores';
import { message as antdMessage } from 'antd';
import { cloneDeep, values } from 'lodash';
import { BehaviorSubject, filter } from 'rxjs';
import _io, { Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import { $video } from '@utils';

const CONFIG = {
  iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }],
};

class RtcSocket {
  readonly roomId;

  readonly peers: { [key: string]: Peer.Instance } = {};

  readonly peerStreams: { [key: string]: MediaStream } = {};

  readonly localStream$ = new BehaviorSubject<MediaStream | null>(null);

  readonly users$ = new BehaviorSubject<IUser[]>([]); // 除了自己的房间其他用户

  readonly io: Socket | undefined;

  constructor(roomId: string) {
    this.roomId = roomId;

    this.io = _io(import.meta.env.VITE_SERVER_HOST, {
      transportOptions: { polling: { extraHeaders: { Authorization: `Bearer ${authStore.token}` } } },
    });

    // 进入页面初始化本地媒体流之后发起加入房间连接
    this.localStream$.pipe(filter((stream) => stream !== null)).subscribe(() => this.joinRoom());

    /** ***************** 监听服务端消息 **************** */
    this.io.on(ESocketMessage.Connect, () => {
      // console.log('连接成功！');
    });

    this.io.on(ESocketMessage.Disconnect, () => {
      // console.log('断开连接！');
    });

    this.io.on(ESocketMessage.Message, (data) => {
      console.log(data);
    });

    this.io.on(ESocketMessage.Joined, ({ room, user }: IRoomUpdateData) => {
      this.roomUpdate(room.users);
      if (authStore.user.id !== user.id) {
        antdMessage.info(`${user.username} 加入房间🎉`);
      }
    });

    this.io.on(ESocketMessage.Leaved, ({ room, user }: IRoomUpdateData) => {
      this.roomUpdate(room.users);
      this.peers[user.id].destroy();
      delete this.peers[user.id];
      delete this.peerStreams[user.id];
      antdMessage.info(`${user.username} 离开房间`);
    });

    // 请求 webRTC 连接
    this.io.on(ESocketMessage.PeerRequest, (user: IUser) => {
      this.preparePeerConnection(user, false);
      // 反馈对方可以进行 webRTC 连接
      this.io!.emit(ESocketMessage.PeerConn, user.socketId);
    });

    // 准备webRTC连接
    this.io.on(ESocketMessage.PeerConn, (user: IUser) => {
      this.preparePeerConnection(user, true);
    });

    this.io.on(ESocketMessage.Signal, (data: ISignalData) => {
      this.peers[data.user.id].signal(data.signal);
    });

    this.io.on(ESocketMessage.Warn, (data) => {
      antdMessage.warning(data);
    });

    this.io.on(ESocketMessage.Info, (data) => {
      antdMessage.info(data);
    });
  }

  roomUpdate = (users: IRoom['users']) => {
    const cloneUsers = cloneDeep(users);
    // 过滤掉自己
    delete cloneUsers[authStore.user.id];
    this.users$.next(values(cloneUsers));
  };

  sendMessage = (roomId: string, message: string) => {
    this.io?.emit(ESocketMessage.Message, { roomId, message });
  };

  joinRoom = () => {
    this.io?.emit(ESocketMessage.Join, this.roomId);
  };

  match = () => {
    this.io?.emit(ESocketMessage.Match, { userId: '1', roomId: '2' });
  };

  preparePeerConnection = ({ id, socketId }: IUser, isInitiator: boolean) => {
    // 实例化对等连接对象
    this.peers[id] = new Peer({
      initiator: isInitiator,
      config: CONFIG,
      stream: this.localStream$.value!,
    });
    // 信令数据传递
    this.peers[id].on(ESocketMessage.Signal, (data) => {
      const signalData = { signal: data, socketId };
      this.io?.emit(ESocketMessage.Signal, signalData);
    });
    // 获取媒体流stream
    this.peers[id].on(ESocketMessage.Stream, (stream) => {
      this.peerStreams[id] = stream;
      $video.addStream(id, stream);
    });
  };

  destroy = () => {
    this.io?.disconnect();
  };
}

export { RtcSocket };
