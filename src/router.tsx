import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import Chat from './pages/Chat';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
];

export const router = createBrowserRouter(routes);
