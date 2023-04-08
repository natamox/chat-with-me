import { EyeOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import React, { forwardRef, Ref } from 'react';
import Webcam from 'react-webcam';
import { IUser } from '@model';

const constraints = {
  width: { min: 640, ideal: 1280 },
  height: { min: 480, ideal: 720 },
  advanced: [{ width: 1920, height: 1280 }, { aspectRatio: 1.333 }],
};

interface IProps {
  user: Partial<IUser>;
  onUserMedia?: (stream: MediaStream) => void;
}
export const BaseCamera = forwardRef(({ user, onUserMedia }: IProps, ref: Ref<Webcam>) => {
  const a = (stream: MediaStream) => {};

  return (
    <StyledContainer>
      <Webcam
        onUserMedia={onUserMedia}
        videoConstraints={constraints}
        ref={ref}
        style={{ width: '100%', height: '100%' }}
      />
      <span style={{ textAlign: 'center' }}>{user?.username}</span>
    </StyledContainer>
  );
});

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const StyledToolbar = styled.div`
  display: flex;
`;

const StyledEyeIcon = styled(EyeOutlined)`
  font-size: 20px;
  color: #fff;
`;

BaseCamera.displayName = 'BaseCamera';
