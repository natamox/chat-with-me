import { ESocketMessage } from '@model';
import { authStore } from '@stores';
import _io, { Socket } from 'socket.io-client';

class RSocket {
  isConnect = false;

  private io: Socket | undefined;

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
      this.isConnect = true;
      console.log('连接成功！');
    });

    this.io.on(ESocketMessage.Disconnect, () => {
      this.isConnect = false;
      console.log('断开连接！');
    });

    this.io.on(ESocketMessage.Message, (data) => {
      console.log(data);
    });

    this.io.on(ESocketMessage.Joined, (data) => {
      console.log('joined');
    });

    this.io.on(ESocketMessage.Leaved, (data) => {
      console.log('leaved');
    });
  }

  sendMessage = (roomId: string, message: string) => {
    this.io?.emit(ESocketMessage.Message, { roomId, message });
  };

  create = (name: string) => {
    this.io?.emit(ESocketMessage.Create, name);
  };

  join = (roomId: string) => {
    console.log('roomId', roomId);
    this.io?.emit(ESocketMessage.Join, roomId);
  };

  match = () => {
    this.io?.emit(ESocketMessage.Match, { userId: '1', roomId: '2' });
  };

  destroy = () => {
    this.io?.disconnect();
    this.io = undefined;
  };
}

export { RSocket };
