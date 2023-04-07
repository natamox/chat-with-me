import { ESocketMessage, IRoom, ISignalData, IUser } from '@model';
import { authStore } from '@stores';
import { message as antdMessage } from 'antd';
import { cloneDeep, filter, map } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import _io, { Socket } from 'socket.io-client';
import Peer from 'simple-peer';

const CONFIG = {
  iceServers: [
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
  ],
};

class RtcSocket {
  peers: { [key: string]: Peer.Instance } = {};

  readonly initSocketId$ = new BehaviorSubject<string>('');

  readonly peerStreams$ = new BehaviorSubject<{ [key: string]: MediaStream }>({});

  readonly isConnect$ = new BehaviorSubject<boolean>(false);

  readonly room$ = new BehaviorSubject<IRoom | undefined>(undefined);

  readonly io: Socket | undefined;

  constructor() {
    this.io = _io('http://127.0.0.1:4399', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      },
    });

    /** ***************** 监听服务端消息 **************** */
    this.io.on(ESocketMessage.Connect, () => {
      this.isConnect$.next(true);
      console.log('连接成功！');
    });

    this.io.on(ESocketMessage.Disconnect, () => {
      this.isConnect$.next(false);
      console.log('断开连接！');
    });

    this.io.on(ESocketMessage.Message, (data) => {
      console.log(data);
    });

    this.io.on(ESocketMessage.Joined, (room: IRoom) => {
      const deepRoom = cloneDeep(room);
      // 过滤掉自己
      deepRoom.users = filter(room.users, (item) => item.id !== authStore.user.id);
      this.room$.next(deepRoom);
    });

    this.io.on(ESocketMessage.Leaved, (data) => {
      console.log('leaved');
    });

    // 请求 webRTC 连接
    this.io.on(ESocketMessage.PeerRequest, (id: string) => {
      this.preparePeerConnection(id, false);
      // 通知对方我已经准备完毕可以进行webRTC连接
      this.io!.emit(ESocketMessage.PeerConn, id);
    });

    // 准备webRTC连接
    this.io.on(ESocketMessage.PeerConn, (id: string) => {
      this.preparePeerConnection(id, true);
    });

    this.io.on(ESocketMessage.Signal, (data: ISignalData) => {
      this.peers[data.socketId].signal(data.signal);
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

  join = (roomId: string) => {
    this.io?.emit(ESocketMessage.Join, roomId);
  };

  match = () => {
    this.io?.emit(ESocketMessage.Match, { userId: '1', roomId: '2' });
  };

  preparePeerConnection = (socketId: string, isInitiator: boolean) => {
    if (isInitiator) {
      console.log('准备连接', socketId, isInitiator);
      this.initSocketId$.next(socketId);
    }
    console.log('准备连接', socketId, isInitiator);

    // 实例化对等连接对象
    this.peers[socketId] = new Peer({
      initiator: isInitiator,
      config: CONFIG,
    });

    // 信令数据传递
    this.peers[socketId].on(ESocketMessage.Signal, (data) => {
      const signalData: ISignalData = { signal: data, socketId };
      this.io?.emit(ESocketMessage.Signal, signalData);
    });

    // 获取媒体流stream
    this.peers[socketId].on(ESocketMessage.Stream, (stream) => {
      console.log('成功获取远程Stream', stream);
      this.peerStreams$.next({ ...this.peerStreams$.value, [socketId]: stream });
    });

    console.log(this.peers);
  };

  destroy = () => {
    this.io?.disconnect();
  };
}

export { RtcSocket };
