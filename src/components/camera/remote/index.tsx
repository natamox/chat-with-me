import { RtcSocket } from '@utils';
import Webcam from 'react-webcam';
import { useEffect, useRef } from 'react';
import { useObservable } from '@hooks';
import { IUser } from '@model';
import { BaseCamera } from '../base';

interface IProps {
  socket: RtcSocket;
  item: IUser;
  style?: React.CSSProperties;
}
export function RemoteCamera({ socket, item, style }: IProps) {
  const { id, socketId } = item;
  const peerStreams = useObservable(socket.peerStreams$);

  const camRef = useRef<Webcam>(null);

  useEffect(() => {
    if (peerStreams?.[id]) {
      camRef.current!.video!.srcObject = peerStreams[id];
    }
  }, [peerStreams, id]);

  return <BaseCamera user={item} ref={camRef} />;
}
