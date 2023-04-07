import styled from '@emotion/styled';
import Webcam from 'react-webcam';
import { useObservable } from '@hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ESocketMessage } from '@model';
import { RtcPeer, RtcSocket } from '@utils';
import { BaseCamera } from '../base';

interface IProps {
  socket: RtcSocket;
  // peer: RtcPeer;
  style?: React.CSSProperties;
}
export function LocalCamera({ socket, style }: IProps) {
  const initSocketId = useObservable(socket.initSocketId$);
  const streamRef = useRef<{ stream: MediaStream | null }>({ stream: null });

  const onCallBack = async (stream: MediaStream) => {
    streamRef.current.stream = stream;
  };

  useEffect(() => {
    if (streamRef.current.stream && initSocketId) {
      socket.peers[initSocketId].addStream(streamRef.current.stream);
    }
  }, [initSocketId, socket.peers]);

  return <BaseCamera onUserMedia={onCallBack} />;
}
