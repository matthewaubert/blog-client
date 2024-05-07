import App from './App';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';

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
    ],
  },
];

export default routerConfig;
