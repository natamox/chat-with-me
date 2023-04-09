const addStream = (id: string, stream: MediaStream) => {
  const video = document.getElementById(`camera_${id}`) as HTMLVideoElement;
  video.srcObject = stream;
  // video.onloadedmetadata = () => {
  //   video.play();
  // };
};

export const $video = { addStream };
