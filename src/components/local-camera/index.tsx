import OBSWebSocket from 'obs-websocket-js';
import React, { useEffect } from 'react';
import Webcam from 'react-webcam';

const myVideo = document.getElementById('local') as HTMLVideoElement;
const obs = new OBSWebSocket();
try {
  const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect('ws://localhost:4455', '[::1]:51906', {
    rpcVersion: 1,
  });
  console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`);
} catch (error) {
  console.log(error);
}

const getMedia = () => {
  // 获取支持的音视频设备
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices()) {
    console.log('不支持');
  } else {
    navigator.mediaDevices
      .enumerateDevices()
      .then((deviceInfos) => {
        deviceInfos.forEach((info) => {
          console.log(`${info.kind}：label=${info.label}：id=${info.deviceId}：group = ${info.groupId}`);
        });
      })
      .catch((err) => {
        console.log(`${err.name}：${err.message}`);
      });
  }
};

function LocalCamera() {
  const start = () => {
    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((stream) => {
    //     console.log('stream', stream);
    //     myVideo.srcObject = stream;
    //   })
    //   .catch(console.error);
    obs.on('ConnectionOpened', () => {
      obs.call('GetSceneList').then((data) => {
        console.log('data', data);
      });
    });
  };

  useEffect(() => {
    getMedia();
  }, []);

  return (
    <>
      <div>
        <button type="button" onClick={start}>
          init
        </button>
      </div>
      <video id="local" autoPlay playsInline muted />
    </>
  );
}

export default LocalCamera;
