import App from './App';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import BecomeAuthor from './pages/BecomeAuthor';
import VerifyEmail from './pages/VerifyEmail';
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';
import CategoryPage from './pages/CategoryPage';
import CreatePost from './pages/CreatePost';

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
        path: 'become-author',
        element: <BecomeAuthor />,
      },
      {
        path: 'verify-email',
        element: <VerifyEmail />,
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
      {
        path: 'author/create-post',
        element: <CreatePost />,
      },
    ],
  },
];

export default routerConfig;
