import { ESocketMessage, IRoom, ISignalData, IUser } from '@model';
import { authStore } from '@stores';
import { message as antdMessage } from 'antd';
import { cloneDeep, filter as _filter } from 'lodash';
import { BehaviorSubject, filter } from 'rxjs';
import _io, { Socket } from 'socket.io-client';
import Peer from 'simple-peer';

const CONFIG = {
  iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }],
};

class RtcSocket {
  roomId;

  peers: { [key: string]: Peer.Instance } = {};

  readonly localStream$ = new BehaviorSubject<MediaStream | null>(null);

  readonly peerStreams$ = new BehaviorSubject<{ [key: string]: MediaStream }>({});

  readonly room$ = new BehaviorSubject<IRoom | undefined>(undefined);

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
      console.log('连接成功！');
    });

    this.io.on(ESocketMessage.Disconnect, () => {
      console.log('断开连接！');
    });

    this.io.on(ESocketMessage.Message, (data) => {
      console.log(data);
    });

    this.io.on(ESocketMessage.Joined, (room: IRoom) => {
      const deepRoom = cloneDeep(room);
      // 过滤掉自己
      deepRoom.users = _filter(room.users, (item) => item.id !== authStore.user.id);
      this.room$.next(deepRoom);
    });

    this.io.on(ESocketMessage.Leaved, (data) => {
      console.log('leaved');
    });

    // 请求 webRTC 连接
    this.io.on(ESocketMessage.PeerRequest, (user: IUser) => {
      this.preparePeerConnection(user, false);
      // 反馈对方可以进行 webRTC 连接
      console.log('user.socketId', user.socketId);
      this.io!.emit(ESocketMessage.PeerConn, user.socketId);
    });

    // 准备webRTC连接
    this.io.on(ESocketMessage.PeerConn, (user: IUser) => {
      this.preparePeerConnection(user, true);
    });

    this.io.on(ESocketMessage.Signal, (data: ISignalData) => {
      console.log('收到信令', data);
      this.peers[data.user.id].signal(data.signal);
    });

    this.io.on(ESocketMessage.Warn, (data) => {
      antdMessage.warning(data);
    });

    this.io.on(ESocketMessage.Info, (data) => {
      antdMessage.info(data);
    });
  }

  sendMessage = (roomId: string, message: string) => {
    this.io?.emit(ESocketMessage.Message, { roomId, message });
  };

  joinRoom = () => {
    this.io?.emit(ESocketMessage.Join, this.roomId);
  };

  match = () => {
    this.io?.emit(ESocketMessage.Match, { userId: '1', roomId: '2' });
  };

  preparePeerConnection = ({ id, socketId, username }: IUser, isInitiator: boolean) => {
    console.log('准备连接', username, isInitiator);
    // 实例化对等连接对象
    this.peers[id] = new Peer({
      initiator: isInitiator,
      config: CONFIG,
      stream: this.localStream$.value!,
    });
    // 信令数据传递
    this.peers[id].on(ESocketMessage.Signal, (data) => {
      const signalData = { signal: data, socketId };
      console.log('信令数据传递', signalData);
      this.io?.emit(ESocketMessage.Signal, signalData);
    });
    // 获取媒体流stream
    this.peers[id].on(ESocketMessage.Stream, (stream) => {
      console.log('成功获取远程 stream', stream);
      this.peerStreams$.next({ ...this.peerStreams$.value, [id]: stream });
    });
    console.log(this.peers);
  };

  destroy = () => {
    console.log('销毁');
    this.io?.disconnect();
  };
}

export { RtcSocket };
