import styled from '@emotion/styled';
import React, { PropsWithChildren } from 'react';

export function PageContainer({ children }: PropsWithChildren) {
  return <StyledContainer>{children}</StyledContainer>;
}

const StyledContainer = styled.div`
  height: 100%;
  width: 100%;
  padding: 16px;
  overflow: hidden;
`;
