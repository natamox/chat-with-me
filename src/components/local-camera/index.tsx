import Webcam from 'react-webcam';

const videoConstraints = {
  width: { min: 480 },
  height: { min: 720 },
  aspectRatio: 0.6666666667,
};
function LocalCamera() {
  const onCallBack = (stream: MediaStream) => {
    console.log('stream', stream.getTracks());
  };
  return <Webcam onUserMedia={onCallBack} />;
}

export default LocalCamera;
