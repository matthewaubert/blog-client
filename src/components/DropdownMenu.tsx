import { useEffect, useRef, useState } from 'react';

interface DropdownMenuProps {
  icon: JSX.Element;
  children?: JSX.Element | JSX.Element[];
  className?: string;
}

/**
 * JSX component for displaying dropdown menu.
 * On click menu toggles open or closed.
 * @param {object} props
 * @param {JSX.Element} props.icon - JSX element to display as menu icon
 * @param {JSX.Element | JSX.Element[]} [props.children] - optional JSX element(s) to display nested w/in
 * @param {className} [props.className] - optional CSS class(es)
 * @returns {JSX.Element}
 */
export default function DropdownMenu({
  icon,
  children,
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // close DropdownMenu when user clicks on link or outside of menu
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!e.target || !navRef.current || !buttonRef.current) return;
      const target = e.target as HTMLElement;

      if (
        target.tagName === 'A' || // if target is a link OR
        // (target isn't `navRef` or `buttonRef` AND
        // neither `navRef` nor `buttonRef` contain target)
        (target !== (navRef.current || buttonRef.current) &&
          !Array.from(navRef.current?.children).includes(target) &&
          !Array.from(buttonRef.current?.children).includes(target))
      ) {
        // console.log('setIsOpen(false)');
        setIsOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        className={'transition-all' + (isOpen ? ' rotate-180' : '')}
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon}
      </button>
      {isOpen && (
        <nav ref={navRef} className={className}>
          {children}
        </nav>
      )}
    </>
  );
}
