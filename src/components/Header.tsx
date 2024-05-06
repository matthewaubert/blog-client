import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js'; // https://pictogrammers.com/library/mdi/icon/magnify/

export default function Header() {
  return (
    <header className="sticky top-0 px-8 py-4 border-b border-gray-200 bg-white flex justify-between items-center shadow-lg">
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
