import { Camera, PageContainer } from '@components';
import styled from '@emotion/styled';
import { RSocket } from '@utils';
import { useUnmount } from 'ahooks';
import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { MessageBoard } from './messageBoard';

export function VideoChatRoom() {
  const { id } = useParams();

  const socket = useMemo(() => new RSocket(), []);

  useEffect(() => {
    if (!id) return;
    socket.join(id);
  }, [id, socket]);

  useUnmount(() => {
    socket.destroy();
  });

  return (
    <PageContainer>
      <StyledContainer>
        <StyledInnerContainer>
          <StyledCameraContainer>
            <StyledCamera>
              <Camera />
            </StyledCamera>
            <StyledCamera>
              <Camera />
            </StyledCamera>
          </StyledCameraContainer>
          <StyledCameraContainer>
            <StyledCamera>
              <Camera />
            </StyledCamera>
            <StyledCamera>
              <Camera />
            </StyledCamera>
          </StyledCameraContainer>
        </StyledInnerContainer>
        <StyledToolBarContainer>
          <MessageBoard socket={socket} roomId={id!} />
        </StyledToolBarContainer>
      </StyledContainer>
    </PageContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  height: 100%;
  overflow: auto;
  flex-direction: column;
`;

const StyledInnerContainer = styled.div``;

const StyledToolBarContainer = styled.div`
  display: flex;
  flex: 1;
`;

const StyledCameraContainer = styled.div`
  display: flex;
`;

const StyledCamera = styled.div`
  padding: 4px;
  width: 100%;
`;
