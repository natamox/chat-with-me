import Webcam from 'react-webcam';

export function Camera() {
  const onCallBack = (stream: MediaStream) => {
    console.log('stream', stream.getTracks());
  };
  return <Webcam onUserMedia={onCallBack} style={{ width: '100%', height: '100%' }} />;
}
