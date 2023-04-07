import styled from '@emotion/styled';
import { RtcSocket } from '@utils';
import Webcam from 'react-webcam';
import { useEffect, useMemo, useRef } from 'react';
import { ESocketMessage } from '@model';
import { useObservable } from '@hooks';
import { BaseCamera } from '../base';

interface IProps {
  socket: RtcSocket;
  socketId: string;
  style?: React.CSSProperties;
}
export function RemoteCamera({ socket, socketId, style }: IProps) {
  const peerStreams = useObservable(socket.peerStreams$);

  const camRef = useRef<Webcam>(null);

  // // 获取媒体流stream
  // socket?.peers[socketId]?.on(ESocketMessage.Stream, (stream) => {
  //   console.log('成功获取远程Stream', stream);
  //   camRef.current!.video!.srcObject = stream;
  // });

  useEffect(() => {
    console.log('peerStreams', peerStreams);
    if (peerStreams?.[socketId]) {
      camRef.current!.video!.srcObject = peerStreams[socketId];
    }
  }, [peerStreams, socketId]);

  return <BaseCamera ref={camRef} />;
}
