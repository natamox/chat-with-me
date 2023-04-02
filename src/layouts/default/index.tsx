import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';
import { LeftSlideBar } from './leftSlideBar';

export const DefaultLayout = memo(
  observer((props: React.PropsWithChildren<ISafeAny>) => (
    <StyledContainer>
      <LeftSlideBar />
      {props.children}
    </StyledContainer>
  )),
);

const StyledContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;
