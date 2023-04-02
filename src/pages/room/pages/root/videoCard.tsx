import React from 'react';
import img from '@assets/images/pokemon-pikachu.jpg';
import styled from '@emotion/styled';

export function VideoCard() {
  return (
    <StyledContainer>
      <StyledImage src={img} alt="房间封面" />
      <StyledTitle>打算打算打算</StyledTitle>
    </StyledContainer>
  );
}

// const StyledContainer = styled.div({
//   display: 'flex',
//   flexDirection: 'column',
//   width: 285,
//   padding: '12px 0px',
//   cursor: 'pointer',
//   borderRadius: 6,
//   boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
//   background: '#fff',
// });

const StyledImage = styled.img({
  objectFit: 'cover',
  objectPosition: 'center',
});

const StyledTitle = styled.div({
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
});

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  max-width: 285px;
  max-height: 200px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  :hover {
    box-shadow: 2px 2px 10px #ddd;
  }
`;
