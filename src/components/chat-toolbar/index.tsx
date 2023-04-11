import {
  EyeInvisibleOutlined,
  EyeOutlined,
  ExportOutlined,
  DesktopOutlined,
  AudioMutedOutlined,
  AudioOutlined,
} from '@ant-design/icons';
import { DEFAULT_CONSTRAINTS, ROUTES } from '@constants';
import styled from '@emotion/styled';
import { RtcSocket } from '@rtc-socket';
import { useBoolean, useMount } from 'ahooks';
import { Select, Tooltip } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useObservable } from '@hooks';
import ScrollToBottom from 'react-scroll-to-bottom';
import { DefaultOptionType } from 'antd/es/select';
import { $video } from '@utils';
import { authStore } from '@stores';
import { values } from 'lodash';
import { MessageBubble } from './message-bubble';

const ICON_STYLE: React.CSSProperties = {
  fontSize: 22,
};

interface IProps {
  socket: RtcSocket;
}
export function ChatToolBar({ socket }: IProps) {
  const navigate = useNavigate();
  const defaultVideoDeviceId = socket.localStream$.value?.getVideoTracks()[0].getSettings().deviceId;
  const [cameraVisible, { setTrue, setFalse }] = useBoolean(true);
  const [audioVisible, { setTrue: setAudioTrue, setFalse: setAudioFalse }] = useBoolean(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messages = useObservable(socket.message$, []);
  const [videoDevices, setVideoDevices] = useState<DefaultOptionType[]>([]);
  const [currentVideoDevice, setVideoCurrentDevice] = useState<string>(defaultVideoDeviceId!);

  const onGetDevices = () => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((_devices) => {
        const _videoDevices = _devices.filter((device) => device.kind === 'videoinput');
        const videoOptions = _videoDevices.map((item) => ({ label: item.label, value: item.deviceId }));
        setVideoDevices(videoOptions);
      })
      .catch((err) => {
        console.log(`${err.name}: ${err.message}`);
      });
  };

  const onVideoDeviceChange = (id: string) => {
    navigator.mediaDevices.getUserMedia({ ...DEFAULT_CONSTRAINTS, video: { deviceId: id } }).then((stream) => {
      onStreamChange(stream);
      socket.localStream$.next(stream);
      setVideoCurrentDevice(id);
    });
  };

  const onShareScreen = () => {
    const constraints = { video: true, audio: false };
    navigator.mediaDevices.getDisplayMedia(constraints).then((stream) => {
      onStreamChange(stream);
    });
  };

  const onStreamChange = (stream: MediaStream) => {
    // eslint-disable-next-line no-param-reassign
    if (!audioVisible) stream.getAudioTracks()[0].enabled = false;
    const oldStream = socket.localStream$.value;
    values(socket.peers).forEach((peer) => {
      peer.removeStream(oldStream!);
      peer.addStream(stream);
    });
    socket.users$.value.forEach((user) => {
      // eslint-disable-next-line no-param-reassign
      socket.peerStreams[user.id] = stream;
    });
    oldStream!.getTracks().forEach((track) => track.stop());
  };

  const onKeyDown = useCallback(
    () => (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (!textareaRef.current?.value) return;
        socket.sendMessage(textareaRef.current.value);
        textareaRef.current.value = '';
      }
    },
    [socket],
  );

  const onLeaveRoom = () => navigate(ROUTES.ROOM);

  const onOpenCamera = () => {
    socket.openCamera();
    setTrue();
  };

  const onCloseCamera = () => {
    socket.closeCamera();
    setFalse();
  };

  const onOpenAudio = () => {
    socket.openAudio();
    setAudioTrue();
  };

  const onCloseAudio = () => {
    socket.closeAudio();
    setAudioFalse();
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', onKeyDown());
      return () => {
        textarea.removeEventListener('keydown', onKeyDown());
      };
    }
  }, [onKeyDown, textareaRef]);

  useEffect(() => {
    if (defaultVideoDeviceId) {
      setVideoCurrentDevice(defaultVideoDeviceId);
    }
  }, [defaultVideoDeviceId]);

  useMount(() => onGetDevices());

  return (
    <StyledBoardContainer>
      <StyledMessageContainer initialScrollBehavior="smooth" followButtonClassName="follow-button">
        {messages?.map((item) => (
          <MessageBubble key={item.id} message={item} />
        ))}
      </StyledMessageContainer>
      <StyledToolbarContainer>
        <StyledOperation>
          <StyledInnerOperation>
            <Tooltip title={cameraVisible ? '关闭摄像头' : '打开摄像头'}>
              {cameraVisible ? (
                <EyeInvisibleOutlined style={ICON_STYLE} onClick={onCloseCamera} />
              ) : (
                <EyeOutlined style={ICON_STYLE} onClick={onOpenCamera} />
              )}
            </Tooltip>
            <Tooltip title={audioVisible ? '关闭麦克风' : '打开麦克风'}>
              {audioVisible ? (
                <AudioMutedOutlined style={ICON_STYLE} onClick={onCloseAudio} />
              ) : (
                <AudioOutlined style={ICON_STYLE} onClick={onOpenAudio} />
              )}
            </Tooltip>
            <Tooltip title="共享屏幕">
              <DesktopOutlined style={ICON_STYLE} onClick={onShareScreen} />
            </Tooltip>
            <Tooltip title="切换摄像头">
              <Select
                value={currentVideoDevice}
                options={videoDevices}
                onChange={onVideoDeviceChange}
                style={{ width: 160 }}
              />
            </Tooltip>
          </StyledInnerOperation>
          <Tooltip title="离开房间">
            <ExportOutlined style={ICON_STYLE} onClick={onLeaveRoom} />
          </Tooltip>
        </StyledOperation>
        <textarea id="message-textarea" ref={textareaRef} />
      </StyledToolbarContainer>
    </StyledBoardContainer>
  );
}

const StyledBoardContainer = styled.div`
  display: flex;
  border: 1px solid rgba(5, 5, 5, 0.06);
  min-height: 400px;
  justify-content: space-between;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  border-radius: 6px;
  textarea {
    height: 120px;
    white-space: pre-wrap;
    border: none;
    border-top: 1px solid rgba(5, 5, 5, 0.06);
    resize: none;
    outline: none;
    background-color: transparent;
    padding: 12px;
    margin: 0;
    :not(:focus):before {
      content: ' ';
      white-space: pre;
    }
    :-webkit-autofill,
    :-webkit-autofill:hover,
    :-webkit-autofill:focus {
      background-color: transparent !important;
      -webkit-box-shadow: none !important;
      box-shadow: none !important;
      color: inherit !important;
    }
  }
`;

const StyledMessageContainer = styled(ScrollToBottom)`
  padding: 12px 0px;
  flex: 1;
  overflow-y: auto;
  .follow-button {
    display: none;
  }
`;

const StyledToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 16px;
`;

const StyledOperation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
`;

const StyledInnerOperation = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 12px;
`;
