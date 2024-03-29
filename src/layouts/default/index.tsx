import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';
import { LeftSlideBar } from './leftSlideBar';

export const DefaultLayout = memo(
  observer((props: React.PropsWithChildren<ISafeAny>) => (
    <StyledContainer>
      <LeftSlideBar />
      <StyledRightContainer>{props.children}</StyledRightContainer>
    </StyledContainer>
  )),
);

const StyledContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const StyledRightContainer = styled.div`
  flex: 1;
  padding: 16px;
  background: #f7f7f7;
  /* background: #f4f5f8; */
`;
