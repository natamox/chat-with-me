import { ChatToolBar, LocalCamera, PageContainer, RemoteCamera } from '@components';
import styled from '@emotion/styled';
import { useUnmount } from 'ahooks';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useObservable } from '@hooks';
import { RtcSocket } from '@rtc-socket';

export function CameraChatRoomPage() {
  const { id = '' } = useParams();
  const socket = useMemo(() => new RtcSocket(id), [id]);

  const users = useObservable(socket.users$, []);

  const room = useObservable(socket.room$);

  useUnmount(() => {
    socket.destroy();
  });

  return (
    <PageContainer>
      <StyledContainer>
        <StyledHeader>{`房间名：${room?.roomName ?? ''}`}</StyledHeader>
        <StyledCameraContainer>
          <LocalCamera socket={socket} />
          <RemoteCamera socket={socket} user={users?.at(0)} />
          <RemoteCamera socket={socket} user={users?.at(1)} />
          <RemoteCamera socket={socket} user={users?.at(2)} />
        </StyledCameraContainer>
        <ChatToolBar socket={socket} />
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

const StyledHeader = styled.div`
  padding: 12px;
  font-size: 18px;
  font-weight: 500;
`;

const StyledCameraContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: auto;
  gap: 2px;
`;
