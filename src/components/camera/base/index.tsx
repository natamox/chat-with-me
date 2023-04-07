import { Ref, forwardRef } from 'react';
import Webcam from 'react-webcam';

interface IProps {
  onUserMedia?: (stream: MediaStream) => void;
}
export const BaseCamera = forwardRef(({ onUserMedia }: IProps, ref: Ref<Webcam>) => (
  <Webcam onUserMedia={onUserMedia} ref={ref} style={{ width: '100%', height: '100%' }} />
));

BaseCamera.displayName = 'BaseCamera';
