import React from 'react';
import img from '@assets/images/pokemon-pikachu.jpg';
import styled from '@emotion/styled';
import { IRoom } from '@model';
import { values } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';

const { Meta } = Card;

interface IProps {
  room?: Omit<IRoom, 'message'>;
}
export function VideoCard({ room }: IProps) {
  const navigate = useNavigate();

  return (
    // <StyledCard onClick={() => navigate(room!.roomId)} hoverable cover={<StyledImage alt="房间封面" src={img} />}>
    <StyledCard onClick={() => navigate(room!.roomId)} hoverable>
      <Meta title={`房间名：${room?.roomName}`} description={`人数：${values(room?.users).length}/4`} />
    </StyledCard>
  );
}

const StyledImage = styled.img({
  objectFit: 'cover',
  objectPosition: 'center',
});

const StyledCard = styled(Card)``;
