import { ROUTES } from '@constants';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RoomRootPage, VideoChatRoom } from './pages';

export function RoomPage() {
  return (
    <Routes>
      <Route index element={<RoomRootPage />} />
      <Route path=":id" element={<VideoChatRoom />} />
      <Route path="*" element={<Navigate to={ROUTES.Room} />} />
    </Routes>
  );
}
