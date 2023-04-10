import styled from '@emotion/styled';
import { IMessage } from '@model';
import { authStore } from '@stores';
import { Avatar } from 'antd';

interface IProps {
  message?: IMessage;
}
export function MessageBubble({ message }: IProps) {
  return (
    <StyledContainer isSelf={message?.user.id === authStore.user.id}>
      <Avatar className="avatar" src="https://joesch.moe/api/v1/random?key=1" size="large" />
      <div>
        <div className="nickname">{message?.user.nickname}</div>
        <div className="bubble">
          <span className="text">{message?.text}</span>
        </div>
      </div>
    </StyledContainer>
  );
}

interface IStyledContainerProps {
  isSelf: boolean;
}
const StyledContainer = styled.div<IStyledContainerProps>`
  display: flex;
  gap: 16px;
  padding: 16px;
  transform: ${(props) => (props.isSelf ? 'scaleX(-1)' : 'none')};
  .avatar {
    transform: ${(props) => (props.isSelf ? 'scaleX(-1)' : 'none')};
  }
  .nickname {
    transform: ${(props) => (props.isSelf ? 'scaleX(-1)' : 'none')};
    text-align: ${(props) => (props.isSelf ? 'right' : 'none')};
  }
  .bubble {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 12px;
    background: ${(props) => (props.isSelf ? '#b7eb8f' : '#fff')};
    border-radius: 10px;
    ::before {
      position: absolute;
      content: '';
      right: 100%;
      border-right: 13px solid ${(props) => (props.isSelf ? '#b7eb8f' : '#fff')};
      border-bottom: 13px solid transparent;
    }
    span {
      word-wrap: break-word;
      word-break: break-all;
    }
  }
  .text {
    transform: ${(props) => (props.isSelf ? 'scaleX(-1)' : 'none')};
    text-align: ${(props) => (props.isSelf ? 'right' : 'none')};
  }
`;
