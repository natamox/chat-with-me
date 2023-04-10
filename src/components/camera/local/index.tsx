import { $video } from '@utils';
import { authStore } from '@stores';
import { useMount } from 'ahooks';
import { RtcSocket } from '@rtc-socket';
import { BaseCamera } from '../base';

const DEFAULT_CONSTRAINTS: MediaStreamConstraints = {
  audio: false,
  video: true,
};

interface IProps {
  socket: RtcSocket;
}

export function LocalCamera({ socket }: IProps) {
  // 获取本地音视频流
  const getVideoStream = async (options: MediaStreamConstraints = DEFAULT_CONSTRAINTS) => {
    const stream = await navigator.mediaDevices.getUserMedia(options);
    $video.updateStream(authStore.user.id, stream);
    socket.localStream$.next(stream);
  };

  useMount(() => {
    getVideoStream();
  });

  return <BaseCamera user={authStore.user} />;
}
