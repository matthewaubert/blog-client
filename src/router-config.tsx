import App from './App';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';

const routerConfig = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'signup',
        // element: </>,
      },
      {
        path: 'login',
        // element: </>,
      },
      {
        path: 'logout',
        // element: </>,
      },
      {
        path: 'users/:userSlug',
        element: <UserPage />,
      },
      {
        path: 'posts/:postSlug',
        element: <PostPage />,
      },
      {
        path: 'categories/:categorySlug',
        // element: </>,
      },
    ],
  },
];

export default routerConfig;
