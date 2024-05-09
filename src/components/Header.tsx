import { useEffect, useRef } from 'react';
import useFetch from '../utils/use-fetch';
import { Link } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js'; // https://pictogrammers.com/library/mdi/icon/magnify/
import { mdiMenu } from '@mdi/js'; // https://pictogrammers.com/library/mdi/icon/menu/
import { ApiResponse, CategoriesData } from '../types';
import { BASE_URL } from '../config';

export default function Header() {
  // TODO: check if window matches media query?
  // TODO: fetch Categories list from API
  const { data, error, loading } = useFetch<ApiResponse<CategoriesData[]>>(
    `${BASE_URL}api/categories?sort[name]=asc`,
  );

  const headerRef = useRef<HTMLElement>(null);

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
      className="sticky top-0 px-8 py-4 bg-white flex justify-between items-center"
    >
      <h1 className="font-bold text-3xl">
        <Link to="/">Blog</Link>
      </h1>
      <DropdownMenu
        icon={<Icon path={mdiMenu} color="#6b7280" className="h-8" />}
        className={
          'absolute left-0 right-0 top-[68px] px-8 py-6 ' +
          'max-h-[calc(100vh-68px)] overflow-y-scroll ' +
          'flex flex-col items-start gap-3 ' +
          'bg-gray-200 border-b border-gray-300 font-bold shadow-lg'
        }
      >
        <Icon path={mdiMagnify} color="#6b7280" className="h-7" />
        <Link to="/signup">Sign up</Link>
        <Link to="/login">Log in</Link>
        <hr className="border border-gray-300 w-full" />
        <>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {data &&
            data.data.map((category) => (
              <Link to={`categories/${category.slug}`} key={category._id}>
                {category.name}
              </Link>
            ))}
        </>
      </DropdownMenu>
    </header>
  );
}
