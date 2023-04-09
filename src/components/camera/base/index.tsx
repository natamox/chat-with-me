import { EyeOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import React from 'react';
import { IUser } from '@model';

interface IProps {
  user?: Partial<IUser>;
}
export function BaseCamera({ user }: IProps) {
  return (
    <StyledContainer>
      <StyledVideo id={`camera_${user?.id}`} autoPlay playsInline />
      <span style={{ textAlign: 'center' }}>{user?.username}</span>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  /* aspect-ratio: 16 / 9; */
`;

const StyledToolbar = styled.div`
  display: flex;
`;

const StyledEyeIcon = styled(EyeOutlined)`
  font-size: 20px;
  color: #fff;
`;
