import styled from '@emotion/styled';
import { RSocket } from '@utils';
import { Input } from 'antd';
import React, { useState } from 'react';

const { TextArea } = Input;

interface IProps {
  socket: RSocket;
  roomId: string;
}
export function MessageBoard({ socket, roomId }: IProps) {
  const [value, setValue] = useState('');

  const onSendMessage = () => {
    setValue((current) => {
      const _value = current.replace(/\n/g, '');
      socket.sendMessage(roomId, _value);
      return _value;
    });
    // console.log('first', e.target.value.replace(/\n/g, ''));
  };

  return (
    <StyledContainer>
      MessageBoard
      <StyledTextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={onSendMessage}
        autoSize={{ minRows: 2, maxRows: 2 }}
      />
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StyledTextArea = styled(TextArea)`
  width: 100% !important;
`;
