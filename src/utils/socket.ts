import { ESocketMessage } from '@model';
import { authStore } from '@stores';
import _io, { Socket } from 'socket.io-client';

class WSocket {
  private io: Socket | undefined;

  // constructor() {}

  sendMessage = (roomId: string, message: string) => {
    this.io?.emit(ESocketMessage.Message, { roomId, message });
  };

  create = () => {
    this.io?.emit(ESocketMessage.Create);
  };

  join = (roomId: string) => {
    console.log('roomId', roomId);
    this.io?.emit(ESocketMessage.Join, '7682580');
  };

  match = () => {
    this.io?.emit(ESocketMessage.Match, { userId: '1', roomId: '2' });
  };

  resister = () => {
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
      console.log('connect success');
    });

    this.io.on(ESocketMessage.Disconnect, () => {
      console.log('Disconnect');
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
  };

  destroy = () => {
    this.io?.disconnect();
    this.io = undefined;
  };
}

const $socket = new WSocket();

export { $socket };
