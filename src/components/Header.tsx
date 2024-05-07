import { useEffect, useRef } from 'react';
import DropdownMenu from './DropdownMenu';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js'; // https://pictogrammers.com/library/mdi/icon/magnify/
import { mdiMenu } from '@mdi/js'; // https://pictogrammers.com/library/mdi/icon/menu/

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

  return (
    <header
      ref={headerRef}
      className="sticky top-0 px-8 py-4 bg-white flex justify-between items-center"
    >
      <h1 className="font-bold text-3xl">
        <a href="">Blog</a>
      </h1>
      <DropdownMenu
        icon={<Icon path={mdiMenu} color="#6b7280" className="h-8" />}
        className="absolute left-0 right-0 top-[68px] px-8 py-6 flex flex-col items-start gap-3 bg-gray-200 border-b border-gray-300 shadow-lg"
      >
        <Icon path={mdiMagnify} color="#6b7280" className="h-7" />
        <a href="" className="">
          Sign up
        </a>
        <a href="" className="">
          Log in
        </a>
      </DropdownMenu>
    </header>
  );
}
