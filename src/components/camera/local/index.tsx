import { RtcSocket } from '@utils';
import { authStore } from '@stores';
import { BaseCamera } from '../base';

interface IProps {
  socket: RtcSocket;
  // peer: RtcPeer;
  style?: React.CSSProperties;
}

export function LocalCamera({ socket, style }: IProps) {
  // const initSocketId = useObservable(socket.initSocketId$);
  // const streamRef = useRef<{ stream: MediaStream | null }>({ stream: null });

  const onCallBack = async (stream: MediaStream) => {
    // streamRef.current.stream = stream;
    socket.localStream$.next(stream);
  };

  // useEffect(() => {
  //   if (streamRef.current.stream && initSocketId) {
  //     socket.peers[initSocketId].addStream(streamRef.current.stream);
  //   }
  // }, [initSocketId, socket.peers]);

  return <BaseCamera user={authStore.user} onUserMedia={onCallBack} />;
}
