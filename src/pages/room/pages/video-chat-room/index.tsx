import { LocalCamera, PageContainer, RemoteCamera } from '@components';
import styled from '@emotion/styled';
import { useUnmount } from 'ahooks';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useObservable } from '@hooks';
import { RtcSocket } from '@rtc-socket';
import { MessageBoard } from './messageBoard';

export function VideoChatRoom() {
  const { id = '' } = useParams();
  const socket = useMemo(() => new RtcSocket(id), [id]);

  const users = useObservable(socket.users$, []);

  useUnmount(() => {
    socket.destroy();
  });

  return (
    <PageContainer>
      <StyledContainer>
        <StyledCameraContainer>
          <LocalCamera socket={socket} />
          <RemoteCamera socket={socket} user={users?.at(0)} />
          <RemoteCamera socket={socket} user={users?.at(1)} />
          <RemoteCamera socket={socket} user={users?.at(2)} />
        </StyledCameraContainer>
        <MessageBoard socket={socket} />
      </StyledContainer>
    </PageContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  height: 100%;
  overflow-y: auto;
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
