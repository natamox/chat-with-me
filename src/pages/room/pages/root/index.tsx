import { PageContainer } from '@components';
import styled from '@emotion/styled';
import { $socket } from '@utils';
import { Button, Modal } from 'antd';
import React, { useEffect } from 'react';
import { useModal } from '@hooks';
import { useNavigate } from 'react-router-dom';
import { VideoCard } from './videoCard';
import { CreateRoomModal } from './createRoomModal';

export function RoomRootPage() {
  const navigate = useNavigate();

  const [openModal, modalProps] = useModal({
    afterComplete: navigate,
  });

  // 加入房间
  function joinRoom() {
    $socket.join('1');
  }
  const sendMessage = () => {
    $socket.sendMessage('1', 'hello');
  };

  const create = () => {
    $socket.create('ssss');
  };

  return (
    <PageContainer>
      <StyledHeader>
        <Button type="primary" style={{ marginBottom: 12 }} onClick={openModal}>
          创建房间
        </Button>
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
      <CreateRoomModal {...modalProps} />
    </PageContainer>
  );
}

const StyledHeader = styled.div`
  display: flex;
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
