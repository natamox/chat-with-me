import { EyeInvisibleOutlined, EyeOutlined, ExportOutlined } from '@ant-design/icons';
import { ROUTES } from '@constants';
import styled from '@emotion/styled';
import { RtcSocket } from '@rtc-socket';
import { useBoolean, useMount } from 'ahooks';
import { Select, Tooltip } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useObservable } from '@hooks';
import ScrollToBottom from 'react-scroll-to-bottom';
import { MessageBubble } from './message-bubble';

const ICON_STYLE: React.CSSProperties = {
  fontSize: 22,
};

interface IProps {
  socket: RtcSocket;
}
export function ChatToolBar({ socket }: IProps) {
  const navigate = useNavigate();
  const [cameraVisible, { setTrue, setFalse }] = useBoolean(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messages = useObservable(socket.message$, []);

  const getDevices = () => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');
        // console.log('videoDevices', videoDevices);
        // console.log('可用的摄像头设备：');
        videoDevices.forEach((device) => {
          console.log(`${device.label} id = ${device.deviceId}`);
        });
      })
      .catch((err) => {
        console.log(`${err.name}: ${err.message}`);
      });
  };

  const handleKeyDown = useCallback(
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

  const leaveRoom = () => navigate(ROUTES.ROOM);

  const opCamera = () => {
    socket.openCamera();
    setTrue();
  };

  const closeCamera = () => {
    socket.closeCamera();
    setFalse();
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown());
      return () => {
        textarea.removeEventListener('keydown', handleKeyDown());
      };
    }
  }, [handleKeyDown, textareaRef]);

  useEffect(() => getDevices(), []);

  return (
    <StyledBoardContainer>
      <StyledMessageContainer initialScrollBehavior="smooth" followButtonClassName="follow-button">
        {messages?.map((item) => (
          <MessageBubble key={item.id} message={item} />
        ))}
      </StyledMessageContainer>
      <StyledToolbarContainer>
        <StyledOperation>
          <Tooltip title={cameraVisible ? '关闭摄像头' : '打开摄像头'}>
            {cameraVisible ? (
              <EyeInvisibleOutlined style={ICON_STYLE} onClick={closeCamera} />
            ) : (
              <EyeOutlined style={ICON_STYLE} onClick={opCamera} />
            )}
          </Tooltip>
          <Tooltip title="离开房间">
            <ExportOutlined style={ICON_STYLE} onClick={leaveRoom} />
          </Tooltip>
          <Select />
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
  /* background: #f6f2f2; */
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
  flex: 1;
  gap: 12px;
  padding: 12px;
`;
