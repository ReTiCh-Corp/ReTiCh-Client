import { createBrowserRouter } from 'react-router-dom';
import Chat from './pages/Chat';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';

export const router = createBrowserRouter([
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
    path: '/chat',
    element: <Chat />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
]);
