import { ESocketMessage, IMessage, IRoom, IRoomUpdateData, IRoomUser, ISignalData } from '@model';
import { authStore } from '@stores';
import { message as antdMessage } from 'antd';
import { cloneDeep, values } from 'lodash';
import { BehaviorSubject, filter } from 'rxjs';
import _io, { Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import { $video } from '@utils';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

const CONFIG = {
  iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }],
};

class RtcSocket {
  readonly roomId;

  readonly room$ = new BehaviorSubject<IRoom | undefined>(undefined);

  readonly peers: { [key: string]: Peer.Instance } = {};

  readonly peerStreams: { [key: string]: MediaStream } = {};

  readonly localStream$ = new BehaviorSubject<MediaStream | null>(null);

  readonly users$ = new BehaviorSubject<IRoomUser[]>([]); // 除了自己的房间其他用户

  readonly message$ = new BehaviorSubject<IMessage[]>([]);

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

    this.io.on(ESocketMessage.Message, (data: IMessage) => {
      this.message$.next([...this.message$.value, data]);
    });

    this.io.on(ESocketMessage.Joined, ({ room, user }: IRoomUpdateData) => {
      this.userUpdate(room.users);
      if (authStore.user.id !== user.id) {
        antdMessage.info(`${user.nickname} 加入房间🎉`);
      } else {
        this.room$.next(room);
        this.message$.next(room.message);
      }
    });

    this.io.on(ESocketMessage.Leaved, ({ room, user }: IRoomUpdateData) => {
      this.userUpdate(room.users);
      this.peers[user.id].destroy();
      delete this.peers[user.id];
      delete this.peerStreams[user.id];
      antdMessage.info(`${user.nickname} 离开房间`);
    });

    this.io.on(ESocketMessage.OpenCamera, (userId: string) => {
      $video.updateStream(userId, this.peerStreams[userId]);
    });

    this.io.on(ESocketMessage.CloseCamera, (userId: string) => {
      $video.updateStream(userId, null);
    });

    // 请求 webRTC 连接
    this.io.on(ESocketMessage.PeerRequest, (user: IRoomUser) => {
      this.preparePeerConnection(user, false);
      // 反馈对方可以进行 webRTC 连接
      this.io!.emit(ESocketMessage.PeerConn, user.socketId);
    });

    // 准备webRTC连接
    this.io.on(ESocketMessage.PeerConn, (user: IRoomUser) => {
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

  userUpdate = (users: IRoom['users']) => {
    const cloneUsers = cloneDeep(users);
    delete cloneUsers[authStore.user.id];
    this.users$.next(values(cloneUsers));
  };

  sendMessage = (text = '') => {
    const id = nanoid();
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const message: IMessage = { id, time, text, user: authStore.user };
    this.io?.emit(ESocketMessage.Message, { message, roomId: this.roomId });
    this.message$.next([...this.message$.value, message]);
  };

  joinRoom = () => {
    this.io?.emit(ESocketMessage.Join, this.roomId);
  };

  openCamera = () => {
    this.io?.emit(ESocketMessage.OpenCamera, this.roomId);
  };

  closeCamera = () => {
    this.io?.emit(ESocketMessage.CloseCamera, this.roomId);
  };

  // match = () => {
  //   this.io?.emit(ESocketMessage.Match, { userId: '1', roomId: '2' });
  // };

  preparePeerConnection = ({ id, socketId }: IRoomUser, isInitiator: boolean) => {
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
      if (!this.room$.value?.users[id].isCameraOpen) return;
      $video.updateStream(id, stream);
    });
  };

  destroy = () => {
    this.io?.disconnect();
  };
}

export { RtcSocket };
