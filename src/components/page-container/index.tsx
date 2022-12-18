import styled from '@emotion/styled';
import React from 'react';

const Container = styled.div`
  padding: 32px;
  background-color: hotpink;
  font-size: 24px;
  border-radius: 4px;
  color: black;
  font-weight: bold;
  &:hover {
    color: white;
  }
`;

function PageContainer({ children }: React.PropsWithChildren<unknown>) {
  return <Container>{children}</Container>;
}

export default PageContainer;
