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
import PostEditorSuite from './pages/PostEditorSuite';
import MyPosts from './pages/MyPosts';

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
        // create a post
        path: 'posts/create',
        element: <PostEditorSuite />,
      },
      {
        // view a post
        path: 'posts/:postSlug',
        element: <PostPage />,
      },
      {
        // edit a post
        path: 'posts/:postSlug/edit',
        element: <PostEditorSuite />,
      },
      {
        // CMS dashboard
        path: 'my-posts',
        element: <MyPosts />,
      },
      {
        // view posts of a particular user
        path: 'users/:userSlug',
        element: <UserPage />,
      },
      {
        // view posts of a particular category
        path: 'categories/:categorySlug',
        element: <CategoryPage />,
      },
    ],
  },
];

export default routerConfig;
