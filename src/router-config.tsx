import App from './App';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
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
        element: <SignupPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
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
