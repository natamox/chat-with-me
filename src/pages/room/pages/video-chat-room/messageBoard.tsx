import styled from '@emotion/styled';
import { RtcSocket } from '@rtc-socket';
import { Input } from 'antd';
import React, { useState } from 'react';

const { TextArea } = Input;

interface IProps {
  socket: RtcSocket;
}
export function MessageBoard({ socket }: IProps) {
  const [value, setValue] = useState('');

  const onSendMessage = () => {
    setValue((current) => {
      const _value = current.replace(/\n/g, '');
      socket.sendMessage(socket.roomId, _value);
      return _value;
    });
  };

  return (
    <StyledContainer>
      <StyledMessageContainer>
        <div style={{ height: 400 }}>123</div>
        <div style={{ height: 400 }}>123</div>
        <div style={{ height: 400 }}>123</div>
        <div style={{ height: 400 }}>123</div>
      </StyledMessageContainer>
      <StyledToolbarContainer>
        <StyledTextArea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onPressEnter={onSendMessage}
          autoSize={{ minRows: 2, maxRows: 2 }}
        />
      </StyledToolbarContainer>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  flex: 1;
`;

const StyledMessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  border-radius: 6px;
  background: #fff;
  box-shadow: 2px 2px 10px #ddd;
`;

const StyledToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 120px;
`;

const StyledTextArea = styled(TextArea)`
  width: 100% !important;
`;
