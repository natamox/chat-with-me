import { PageContainer } from '@components';
import styled from '@emotion/styled';
import { $socket } from '@utils';
import { Button } from 'antd';
import React from 'react';

export function RoomPage() {
  // 加入房间
  function joinRoom() {
    $socket.join('1');
  }
  const sendMessage = () => {
    $socket.sendMessage('1', 'hello');
  };

  const create = () => {
    $socket.create();
  };
  // useEffect(() => {
  //   console.log('first');
  //   return () => {
  //     socket.destroy();
  //   };
  // }, [socket]);

  // useEffect(() => {
  //   $socket.resister()
  //   return () => $socket.destroy()
  // }, [$socket])

  return (
    <PageContainer>
      {/* <PageHeader title={<ColumnName name={name} />} onBack={onBack} extra={headerExtra} /> */}
      <StyledHeader>
        <Button type="primary">创建房间</Button>
      </StyledHeader>
      {/* <button type="button" onClick={joinRoom}>
        加入
      </button>
      <button type="button" onClick={sendMessage}>
        消息
      </button>
      <button type="button" onClick={create}>
        创建
      </button> */}
    </PageContainer>
  );
}

const StyledHeader = styled.div`
  display: flex;
`;

const StyledContent = styled.div`
  display: 'grid';
`;
