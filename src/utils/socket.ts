import { ESocketMessage } from '@model';
import _io from 'socket.io-client';

class Socket {
  id: string;

  private io;

  constructor(id: string) {
    this.id = id;
    this.io = _io('http://127.0.0.1:4399');
  }

  /** ***************** 监听服务端消息 **************** */

  // connect = () => {
  //   this.io.on(ESocketMessage.Connect, () => {
  //     console.log('connect success');
  //   });
  // };

  // destroy = () => {
  //   this.io.disconnect();
  // };
}

// // 连接到信令服务
// const socket = io('http://localhost:4399');

// // 连接成功时触发
// socket.on('connect', () => {
//   console.log('connect success');
//   // handleConnect();
// });

// // 断开连接时触发
// socket.on('disconnect', (reason) => {
//   if (reason === 'io server disconnect') {
//     // 断线是由服务器发起的，重新连接。
//     socket.connect();
//   }
//   // ElMessage.warning('您已断开连接');
// });
// // 服务端发送报错信息
// socket.on('error', (data) => {
//   ElMessage.error(data);
// });
// // 当有用户加入房间时触发
// socket.on('welcome', (data) => {
//   ElMessage.success(data.userId === userId ? '🦄成功加入房间' : `🦄${data.userId}加入房间`);
// });
// // 当有用户离开房间时触发
// socket.on('leave', (data) => {
//   ElMessage.warning(data.userId === userId ? '🦄成功离开房间' : `🦄${data.userId}离开房间`);
// });
// // 当有用户发送消息时触发
// socket.on('message', (data) => {});
// // 创建offer,发送给远端
// socket.on('createOffer', (data) => {
//   // 如果已经创建过，直接发送
//   if (offerSdp) {
//     socket.emit('offer', {
//       userId,
//       roomId: roomId.value,
//       sdp: offerSdp,
//     });
//     return;
//   }
//   createOffer(); // 创建 offer
// });
// // 收到offer,创建answer
// socket.on('offer', (data) => {
//   createAnswer(data.sdp);
// });
// // 收到answer,设置远端sdp
// socket.on('answer', (data) => {
//   addAnswer(data.sdp);
// });

export default Socket;
