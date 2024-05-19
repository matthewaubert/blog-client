import { useRouteError, Link, isRouteErrorResponse } from 'react-router-dom';
import AuthProvider from '../AuthProvider';
import Header from '../components/Header';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <AuthProvider>
      <Header />
      <main className="flex flex-col gap-6 text-center">
        <h2 className="text-5xl">Oops!</h2>
        <h3>Sorry, an unexpected error has occurred.</h3>
        <p>{getErrorMsg(error)}</p>
        <Link to="/" className="login">
          Click here to go back home.
        </Link>
      </main>
    </AuthProvider>
  );
}

function getErrorMsg(error: unknown) {
  let errorMsg: string;
  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMsg = (error.data as string) || `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMsg = error.message;
  } else if (typeof error === 'string') {
    errorMsg = error;
  } else {
    errorMsg = 'Unknown error';
  }

  return errorMsg;
}
