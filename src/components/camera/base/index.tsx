import { AimOutlined, CompressOutlined, ExpandOutlined, EyeOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IUser } from '@model';
import { useFullscreen, useHover, useInterval, useUnmount } from 'ahooks';
import { Tooltip } from 'antd';
import RecordRTC from 'recordrtc';
import saveAs from 'file-saver';

interface IProps {
  muted?: boolean;
  user?: Partial<IUser>;
}
export function BaseCamera({ muted = false, user }: IProps) {
  const maskRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isHovering = useHover(maskRef);
  const [isRecord, setIsRecord] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [interval, setInterval] = useState<number | undefined>(undefined);
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(maskRef);
  const [, { toggleFullscreen: togglePageFullscreen }] = useFullscreen(maskRef, { pageFullscreen: true });
  const stream = videoRef.current?.srcObject as MediaStream;
  const recorder = useMemo(() => {
    if (stream) return new RecordRTC(stream, { type: 'video' });
  }, [stream]) as RecordRTC;

  const clearInterval = useInterval(() => {
    setSeconds((cur) => cur + 1);
  }, interval);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const _seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${_seconds.toString().padStart(2, '0')}`;
  };

  const onToggleRecord = () => {
    if (isRecord) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        saveAs(blob, `${user?.nickname}.webm`);
      });
      setIsRecord(false);
      setInterval(undefined);
      setSeconds(0);
      return;
    }
    recorder.startRecording();
    setIsRecord(true);
    setInterval(1000);
  };

  useUnmount(() => clearInterval());

  return (
    <StyledContainer>
      <StyledMaskContainer ref={maskRef}>
        <StyledBlink isRecord={isRecord} />
        <StyledMask isHovering={isFullscreen ? false : isHovering}>
          <span className="time">{isRecord && formatTime(seconds)}</span>
          <div className="operation">
            <Tooltip title="页面全屏">
              <CompressOutlined onClick={togglePageFullscreen} />
            </Tooltip>
            <Tooltip title="全屏">
              <ExpandOutlined onClick={toggleFullscreen} />
            </Tooltip>
            <Tooltip title={`${isRecord ? '结束录制' : '开始录制'}`}>
              <AimOutlined onClick={onToggleRecord} />
            </Tooltip>
          </div>
        </StyledMask>
        <StyledVideo id={`camera_${user?.id}`} autoPlay playsInline muted={muted} ref={videoRef} />
      </StyledMaskContainer>
      <span style={{ textAlign: 'center' }}>{user?.nickname}</span>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const StyledMaskContainer = styled.div`
  height: 100%;
  width: 100%;
`;
interface IStyledMaskProps {
  isHovering: boolean;
}
const StyledMask = styled.div<IStyledMaskProps>`
  position: absolute;
  display: flex;
  background-color: rgba(35, 35, 35, 0.4);
  visibility: ${(props) => (props.isHovering ? 'visible' : 'hidden')};
  height: calc(100% - 23px);
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  opacity: ${(props) => (props.isHovering ? 1 : 0)};
  transition: all 0.3s ease-in-out;
  .time {
    padding: 12px;
    color: red;
    text-align: right;
  }
  .operation {
    text-align: right;
    z-index: 1;
    span {
      color: #fff;
      font-size: 22px;
      margin: 6px;
      cursor: pointer;
    }
  }
`;

interface IStyledBlinkProps {
  isRecord: boolean;
}
const StyledBlink = styled.video<IStyledBlinkProps>`
  position: absolute;
  height: calc(100% - 23px);
  width: 100%;
  box-sizing: border-box;
  border: 1.5px solid red;
  border: ${(props) => (props.isRecord ? '1.5px solid red' : 'none')};
  animation: blink 1s infinite;
  @keyframes blink {
    0% {
      border-color: red;
    }
    50% {
      border-color: transparent;
    }
    100% {
      border-color: red;
    }
  }
`;

const StyledVideo = styled.video`
  background-color: #000;
  height: 100%;
  width: 100%;
  /* aspect-ratio: 16 / 9; */
`;
