import { PageContainer } from '@components';
import styled from '@emotion/styled';
import { Button, Empty, List, Tooltip, message } from 'antd';
import React, { useRef } from 'react';
import { useModal } from '@hooks';
import { useNavigate } from 'react-router-dom';
import { ERoomType } from '@pages/room/models';
import { useRequest } from 'ahooks';
import { getRoomList, match } from '@pages/room/services';
import { VideoCard } from './videoCard';
import { RoomModal } from './roomModal';
import { MatchModal } from './matchModal';

export function RoomRootPage() {
  const navigate = useNavigate();
  const typeRef = useRef<{ type: ERoomType }>({ type: ERoomType.Create });

  const { data } = useRequest(getRoomList, {
    pollingInterval: 5000,
  });

  const [openModal, modalProps] = useModal({
    afterComplete: navigate,
  });

  const [openMatchModal, matchModalProps] = useModal();

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
        <Tooltip title="随机匹配一位路人 ">
          <Button onClick={openMatchModal}>在线匹配</Button>
        </Tooltip>
      </StyledHeader>
      <StyledContent>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 7 }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <VideoCard room={item} />
            </List.Item>
          )}
        />
      </StyledContent>
      <RoomModal type={typeRef.current.type} {...modalProps} />
      <MatchModal {...matchModalProps} />
    </PageContainer>
  );
}

const StyledHeader = styled.div`
  display: flex;
  margin-bottom: 12px;
  gap: 12px;
`;

const StyledContent = styled.div`
  padding: 12px;
  margin: 12px;
  height: calc(100% - 84px);
  overflow-y: auto;
`;
