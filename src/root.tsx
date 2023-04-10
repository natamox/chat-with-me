import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { authStore } from '@stores';
import { DefaultLayout } from '@layouts';
import { ROUTES } from '@constants';
import { LoginPage, MatchPage, RoomPageRoutes, UserProfilePage } from '@pages';

function Layout() {
  const authenticated = !!authStore.token;

  if (!authenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
}

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.ROOT,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.ROOM} />,
      },
      {
        path: ROUTES.USER,
        element: <UserProfilePage />,
      },
      {
        path: `${ROUTES.ROOM}/*`,
        children: RoomPageRoutes,
      },
      {
        path: ROUTES.MATH,
        element: <MatchPage />,
      },
      {
        path: '*',
        element: <Navigate to={ROUTES.ROOM} />,
      },
    ],
  },
]);

function Root() {
  return <RouterProvider router={router} />;
}

export default Root;
