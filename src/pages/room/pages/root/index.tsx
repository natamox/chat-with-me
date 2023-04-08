import { PageContainer } from '@components';
import styled from '@emotion/styled';
import { Button } from 'antd';
import React, { useRef } from 'react';
import { useModal } from '@hooks';
import { useNavigate } from 'react-router-dom';
import { ERoomType } from '@pages/room/models';
import { VideoCard } from './videoCard';
import { RoomModal } from './roomModal';

export function RoomRootPage() {
  const navigate = useNavigate();
  const typeRef = useRef<{ type: ERoomType }>({ type: ERoomType.Create });

  const [openModal, modalProps] = useModal({
    afterComplete: navigate,
  });

  function joinRoom() {
    typeRef.current.type = ERoomType.Join;
    openModal();
  }

  const createRoom = () => {
    typeRef.current.type = ERoomType.Create;
    openModal();
  };

  return (
    <PageContainer>
      <StyledHeader>
        <Button type="primary" onClick={createRoom}>
          创建房间
        </Button>
        <Button onClick={joinRoom}>加入房间</Button>
      </StyledHeader>
      <StyledContent>
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
      </StyledContent>
      <RoomModal type={typeRef.current.type} {...modalProps} />
    </PageContainer>
  );
}

const StyledHeader = styled.div`
  display: flex;
  margin-bottom: 12px;
  gap: 12px;
`;

const StyledContent = styled.div`
  padding: 12px 0;
  height: calc(100% - 84px);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(285px, 1fr));
  grid-auto-flow: dense;
  gap: 12px;
  overflow-y: auto;
`;
