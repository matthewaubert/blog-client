import { useEffect, useRef } from 'react';
import { useAuth, isPayloadExpired } from '../utils/auth-utils';
import useFetch from '../utils/use-fetch';
import { Link } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';
import Icon from '@mdi/react';
// import { mdiMagnify } from '@mdi/js'; // https://pictogrammers.com/library/mdi/icon/magnify/
import { mdiChevronDown } from '@mdi/js'; // https://pictogrammers.com/library/mdi/icon/chevron-down/
import { ApiResponse, CategoryData } from '../types';
import { BASE_URL } from '../config';
import { decode } from 'he';

export default function Header() {
  const { authData, logout } = useAuth();
  const headerRef = useRef<HTMLElement>(null);
  const { data, error, loading } = useFetch<ApiResponse<CategoryData[]>>(
    `${BASE_URL}api/categories?sort[name]=asc`,
  );

  // TODO: check if window matches media query?

  // add shadow to Header when user scrolls down, remove when scrolls back to top
  useEffect(() => {
    function onScroll() {
      if (headerRef.current) {
        window.scrollY > 0
          ? headerRef.current.classList.add('header-shadow')
          : headerRef.current.classList.remove('header-shadow');
      }
    }

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  });

  return (
    <header
      ref={headerRef}
      className="sticky top-0 py-4 bg-white flex justify-between items-center"
    >
      <h1>
        <Link to="/">Blog</Link>
      </h1>
      <DropdownMenu
        icon={
          <Icon
            path={mdiChevronDown}
            color=""
            className="h-9 fill-gray-500 hover:fill-blue-500"
          />
        }
        className={
          'absolute left-0 right-0 top-[68px] ' +
          'max-h-[calc(100vh-68px)] overflow-y-scroll ' +
          'flex flex-col items-start gap-3 ' +
          'bg-gray-200 border-b border-gray-300 font-bold shadow-lg'
        }
      >
        {/* <Icon path={mdiMagnify} color="" className="h-7 fill-gray-500" /> */}
        {!isPayloadExpired(authData) ? (
          <Link to="/" onClick={logout}>Log out</Link>
        ) : (
          <>
            <Link to="/signup">Sign up</Link>
            <Link to="/login">Log in</Link>
          </>
        )}
        <hr className="border border-gray-300 w-full" />
        <>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {data &&
            data.data.map((category) => (
              <Link to={`categories/${category.slug}`} key={category._id}>
                {decode(category.name)}
              </Link>
            ))}
        </>
      </DropdownMenu>
    </header>
  );
}
