import { ROUTES } from '@constants';
import { message } from 'antd';
import React from 'react';
import { LoaderFunctionArgs, Navigate, redirect } from 'react-router-dom';
import { ERoomType } from '@model';
import { values } from 'lodash';
import { CameraChatRoomPage, RoomRootPage, MatchChatRoomPage } from './pages';
import { getRoom } from './services';

async function loader({ params }: LoaderFunctionArgs) {
  const { id = '' } = params;
  if (!/^\d{7}$/.test(id)) {
    message.warning('房间号格式不正确！');
    return redirect(ROUTES.ROOM);
  }
  const room = await getRoom(id);
  if (!room || room.type !== ERoomType.Chat) {
    message.warning('未找到该房间！');
    return redirect(ROUTES.ROOM);
  }
  if (values(room.users).length === 4) {
    message.warning('房间人数已满！');
    return redirect(ROUTES.ROOM);
  }
  return true;
}
async function matchLoader({ params }: LoaderFunctionArgs) {
  const { id = '' } = params;
  const room = await getRoom(id);
  if (!room || room.type !== ERoomType.Match) {
    message.warning('未找到该房间！');
    return redirect(ROUTES.ROOM);
  }
  return true;
}

export const RoomPageRoutes = [
  {
    index: true,
    element: <RoomRootPage />,
  },
  {
    path: ':id',
    loader,
    element: <CameraChatRoomPage />,
  },
  {
    path: 'match/:id',
    loader: matchLoader,
    element: <MatchChatRoomPage />,
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.ROOM} replace />,
  },
];
