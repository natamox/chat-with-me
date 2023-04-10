import { memo, useEffect } from 'react';
import { IRoomUser } from '@model';
import NoUserSvg from '@assets/icons/no-user.svg';
import styled from '@emotion/styled';
import { $video } from '@utils';
import { RtcSocket } from '@rtc-socket';
import { BaseCamera } from '../base';

interface IProps {
  socket: RtcSocket;
  user?: IRoomUser;
}
export const RemoteCamera = memo(({ socket, user }: IProps) => {
  useEffect(() => {
    if (!user) return;
    $video.updateStream(user?.id, socket.peerStreams[user?.id]);
  }, [socket.peerStreams, user]);

  return user ? <BaseCamera user={user} /> : <StyledImg src={NoUserSvg} alt="等待加入......" />;
});

const StyledImg = styled.img`
  margin: auto;
  width: 60%;
`;
