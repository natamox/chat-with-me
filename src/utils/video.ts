import { authStore } from '@stores';

const updateStream = (id: string, stream: MediaStream | null) => {
  const video = document.getElementById(`camera_${id}`) as HTMLVideoElement;
  video.srcObject = stream;
};

const getLocalStream = () => {
  const video = document.getElementById(`camera_${authStore.user.id}`) as HTMLVideoElement;
  return video.srcObject as MediaStream;
};

export const $video = { updateStream, getLocalStream };
