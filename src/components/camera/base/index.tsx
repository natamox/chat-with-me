import { EyeOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import React, { useEffect, useRef } from 'react';
import { IUser } from '@model';

interface IProps {
  user?: Partial<IUser>;
}
export function BaseCamera({ user }: IProps) {
  return (
    <StyledContainer>
      <StyledVideo id={`camera_${user?.id}`} autoPlay playsInline />
      <span style={{ textAlign: 'center' }}>{user?.nickname}</span>
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
  background-color: #000;
  width: 100%;
  height: 100%;
  /* aspect-ratio: 16 / 9; */
`;
