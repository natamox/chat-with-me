import { ESocketMessage, IMessage, IRoom, IRoomUpdateData, IRoomUser, ISignalData } from '@model';
import { authStore } from '@stores';
import { message as antdMessage } from 'antd';
import { cloneDeep, keyBy, values } from 'lodash';
import adapter from 'webrtc-adapter';
import { BehaviorSubject, filter } from 'rxjs';
import _io, { Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import { $video } from '@utils';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

const CONFIG: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

class RtcSocket {
  readonly roomId;

  isJoined = false;

  readonly room$ = new BehaviorSubject<IRoom | undefined>(undefined);

  readonly peers: { [key: string]: Peer.Instance } = {};

  readonly peerStreams: { [key: string]: MediaStream } = {};

  cloneLocalStream: MediaStream | null = null;

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
    this.localStream$.pipe(filter((stream) => stream !== null)).subscribe((res) => {
      // 这里本地使用的是克隆的那一份是因为后面关闭、打开摄像头的时候会把本地的也给关闭了，为了避免这种情况
      this.cloneLocalStream = res!.clone();
      $video.updateStream(authStore.user.id, this.cloneLocalStream!);
      // 这里返回是因为后续切换摄像头是会再次触发这个流，但是不需要再次加入房间
      if (this.isJoined) return;
      this.joinRoom();
    });

    /** ***************** 监听服务端消息 **************** */
    this.io.on(ESocketMessage.Connect, () => {});

    this.io.on(ESocketMessage.Disconnect, () => {});

    this.io.on(ESocketMessage.Message, (data: IMessage) => {
      this.message$.next([...this.message$.value, data]);
    });

    this.io.on(ESocketMessage.Joined, ({ room, user }: IRoomUpdateData) => {
      this.userUpdate(room.users);
      if (authStore.user.id !== user.id) {
        // antdMessage.info(`${user.nickname} 加入房间🎉`);
      } else {
        this.room$.next(room);
        this.message$.next(room.message);
        this.isJoined = true;
      }
    });

    this.io.on(ESocketMessage.Leaved, ({ room, user }: IRoomUpdateData) => {
      this.userUpdate(room.users);
      this.peers[user.id].destroy();
      delete this.peers[user.id];
      delete this.peerStreams[user.id];
      // antdMessage.info(`${user.nickname} 离开房间`);
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
    const stream = this.localStream$.value as MediaStream;
    stream.getVideoTracks().forEach((track, index) => {
      stream.getVideoTracks()[index].enabled = true;
    });
    // stream.getVideoTracks()[0].enabled = true;
  };

  closeCamera = () => {
    const stream = this.localStream$.value as MediaStream;
    stream.getVideoTracks().forEach((track, index) => {
      stream.getVideoTracks()[index].enabled = false;
    });
    // stream.getVideoTracks()[0].enabled = false;
  };

  closeAudio() {
    const stream = this.localStream$.value as MediaStream;
    stream.getAudioTracks().forEach((track, index) => {
      stream.getAudioTracks()[index].enabled = false;
    });
    // stream.getAudioTracks()[0].enabled = false;
  }

  openAudio() {
    const stream = this.localStream$.value as MediaStream;
    stream.getAudioTracks().forEach((track, index) => {
      stream.getAudioTracks()[index].enabled = true;
    });
    // stream.getAudioTracks()[0].enabled = true;
  }

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
      $video.updateStream(id, stream);
    });
  };

  destroy = () => {
    this.localStream$.value?.getTracks().forEach((track) => {
      track.stop();
    });
    this.io?.disconnect();
  };
}

export { RtcSocket };
