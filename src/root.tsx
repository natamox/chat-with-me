import { HashRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { authStore } from '@stores';
import { DefaultLayout } from '@layouts';
import { ROUTES } from '@constants';
import { RoomPage, MatchPage, LoginPage } from '@pages';
import { useEffect } from 'react';
import { $socket } from '@utils';

function Layout() {
  const authenticated = !!authStore.token;

  if (!authenticated) {
    return <Navigate to={ROUTES.Login} replace />;
  }

  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.Login} element={<LoginPage />} />
      <Route path={ROUTES.Root} element={<Layout />}>
        <Route index element={<Navigate to={ROUTES.Room} />} />
        <Route path={`${ROUTES.Room}/*`} element={<RoomPage />} />
        <Route path={ROUTES.Math} element={<MatchPage />} />
        <Route path="*" element={<Navigate to={ROUTES.Room} />} />
      </Route>
    </Routes>
  );
}

function Root() {
  useEffect(() => {
    $socket.resister();
    return () => $socket.destroy();
  }, []);

  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}

export default Root;
