import App from './App';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';
import CategoryPage from './pages/CategoryPage';

const routerConfig = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
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
        element: <CategoryPage />,
      },
    ],
  },
];

export default routerConfig;
