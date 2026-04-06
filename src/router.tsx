import { AuthProvider } from '@retish/auth/react';
import {
  createBrowserRouter,
  Outlet,
  type RouteObject,
} from 'react-router-dom';
import { auth } from './auth';
import AuthGuard from './components/guards/AuthGuard';
import OnboardingGuard from './components/guards/OnboardingGuard';
import AppLayout from './components/layout/AppLayout';
import Callback from './pages/Callback';
import Chat from './pages/Chat';
import Home from './pages/Home';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import OnboardingSuccess from './pages/OnboardingSuccess';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Register from './pages/Register';
import Settings from './pages/Settings';

function Root() {
  return (
    <AuthProvider auth={auth}>
      <Outlet />
    </AuthProvider>
  );
}

export const routes: RouteObject[] = [
  {
    element: <Root />,
    children: [
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/callback',
        element: <Callback />,
      },
      {
        path: '/',
        element: <Home />,
      },
      {
        element: <OnboardingGuard />,
        children: [
          {
            path: '/onboarding',
            element: <Onboarding />,
          },
        ],
      },
      {
        path: '/onboarding/success',
        element: <OnboardingSuccess />,
      },
      {
        element: <AuthGuard />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: '/chat',
                element: <Chat />,
              },
              {
                path: '/settings',
                element: <Settings />,
              },
              {
                path: '/profile',
                element: <Profile />,
              },
              {
                path: '/profile/edit',
                element: <ProfileEdit />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
