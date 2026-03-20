import { createBrowserRouter, Outlet, type RouteObject } from 'react-router-dom';
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
import Register from './pages/Register';
import Settings from './pages/Settings';
import { ReTiChAuth } from "@retish/auth"
import { AuthProvider } from "@retish/auth/react"

const auth = new ReTiChAuth({
  baseUrl: import.meta.env.VITE_AUTH_BASE_URL,
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
  clientSecret: import.meta.env.VITE_AUTH_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_AUTH_REDIRECT_URI,
})

function Root() {
  return (
    <AuthProvider auth={auth}>
      <Outlet />
    </AuthProvider>
  )
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
            ],
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
