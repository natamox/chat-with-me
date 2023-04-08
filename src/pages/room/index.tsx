import { ROUTES } from '@constants';
import { message } from 'antd';
import React from 'react';
import { LoaderFunctionArgs, Navigate, redirect } from 'react-router-dom';
import { RoomRootPage, VideoChatRoom } from './pages';

function loader({ params }: LoaderFunctionArgs) {
  const { id = '' } = params;
  if (!/^\d{7}$/.test(id)) {
    message.warning('房间号格式不正确！');
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
    element: <VideoChatRoom />,
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.ROOM} replace />,
  },
];
