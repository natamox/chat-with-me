import { LocalCamera, PageContainer, RemoteCamera } from '@components';
import styled from '@emotion/styled';
import { RtcPeer, RtcSocket } from '@utils';
import { useUnmount } from 'ahooks';
import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useObservable } from '@hooks';
import { Empty } from 'antd';
import { MessageBoard } from './messageBoard';

export function VideoChatRoom() {
  const { id } = useParams();
  const socket = useMemo(() => new RtcSocket(), []);

  const room = useObservable(socket.room$);

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
        <StyledCameraContainer>
          <LocalCamera socket={socket} />
          {room?.users.map((item) => (
            <RemoteCamera key={item.id} socketId={item.socketId} socket={socket} />
          ))}
        </StyledCameraContainer>
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

const StyledToolBarContainer = styled.div`
  display: flex;
  flex: 1;
`;

const StyledCameraContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: auto;
  gap: 2px;
`;
