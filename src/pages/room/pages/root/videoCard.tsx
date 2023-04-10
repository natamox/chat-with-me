import React from 'react';
import img from '@assets/images/pokemon-pikachu.jpg';
import styled from '@emotion/styled';
import { IRoom } from '@model';
import { values } from 'lodash';
import { useNavigate } from 'react-router-dom';

interface IProps {
  room: Omit<IRoom, 'message'>;
}
export function VideoCard({ room }: IProps) {
  const navigate = useNavigate();

  return (
    <StyledContainer onClick={() => navigate(room.roomId)}>
      <StyledImage src={img} alt="房间封面" />
      <StyledTitle>
        <span style={{ fontWeight: 'bold' }}>{room?.roomName}</span>
        <span>{`${values(room.users).length}/4`}</span>
      </StyledTitle>
    </StyledContainer>
  );
}

const StyledImage = styled.img({
  objectFit: 'cover',
  objectPosition: 'center',
});

const StyledTitle = styled.div`
  display: flex;
  height: 40px;
  justify-content: space-between;
  padding: 6px;
  font-size: 16px;
  align-items: center;
`;

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
