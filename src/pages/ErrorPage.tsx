import { useRouteError } from 'react-router-dom';

// TODO: 
//   – create real error page
//   – resolve `error` type issue below

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div>
      <h2 className='font-bold text-2xl'>Oops!</h2>
      <p>Sorry, an unexpected error has occurred.</p>
      <i>{error.statusText || error.message}</i>
    </div>
  );
}
