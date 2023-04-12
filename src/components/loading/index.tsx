import Lottie from 'lottie-react';
import loadingJson from '@assets/lottie/loading.json';

function Loading() {
  return <Lottie style={{ height: 180 }} animationData={loadingJson} />;
}

export default Loading;
