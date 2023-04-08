import { LocalCamera, PageContainer, RemoteCamera } from '@components';
import styled from '@emotion/styled';
import { RtcSocket } from '@utils';
import { useUnmount } from 'ahooks';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useObservable } from '@hooks';
import { MessageBoard } from './messageBoard';

export function VideoChatRoom() {
  const { id = '' } = useParams();
  const socket = useMemo(() => new RtcSocket(id), [id]);

  const room = useObservable(socket.room$);

  console.log(room);

  useUnmount(() => {
    socket.destroy();
  });

  return (
    <PageContainer>
      <StyledContainer>
        <StyledCameraContainer>
          <LocalCamera socket={socket} />
          {room?.users.map((item) => (
            <RemoteCamera key={item.id} item={item} socket={socket} />
          ))}
        </StyledCameraContainer>
        {/* <StyledToolBarContainer> */}
        {/*  <MessageBoard socket={socket} /> */}
        {/* </StyledToolBarContainer> */}
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
