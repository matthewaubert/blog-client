import { useEffect, useRef } from 'react';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js'; // https://pictogrammers.com/library/mdi/icon/magnify/

export default function Header() {
  // TODO: check if window matches media query
  // TODO: fetch Categories list from API

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

  // TODO: Build Hamburger Menu

  return (
    <header
      ref={headerRef}
      className="sticky top-0 px-8 py-4 bg-white flex justify-between items-center"
    >
      <h1 className="font-bold text-3xl">
        <a href="">Blog</a>
      </h1>
      <nav className="flex gap-3 items-center">
        <Icon path={mdiMagnify} color="#6b7280" className="h-7" />
        <a href="" className="bg-blue-500 text-white text-sm rounded px-3 py-2">
          Sign up
        </a>
        <a href="" className="bg-blue-500 text-white text-sm rounded px-3 py-2">
          Log in
        </a>
      </nav>
    </header>
  );
}
