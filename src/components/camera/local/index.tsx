import { $video } from '@utils';
import { authStore } from '@stores';
import { useMount } from 'ahooks';
import { RtcSocket } from '@rtc-socket';
import { DEFAULT_CONSTRAINTS } from '@constants';
import { BaseCamera } from '../base';

interface IProps {
  socket: RtcSocket;
}

export function LocalCamera({ socket }: IProps) {
  // 获取本地音视频流
  const getVideoStream = async (options: MediaStreamConstraints = DEFAULT_CONSTRAINTS) => {
    navigator.mediaDevices
      .getUserMedia(options)
      .then((stream) => {
        socket.localStream$.next(stream);
      })
      .catch(console.error);
  };

  useMount(() => {
    getVideoStream();
  });

  return <BaseCamera muted user={authStore.user} />;
}
