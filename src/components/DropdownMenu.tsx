import { useState } from 'react';

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

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>{icon}</button>
      {isOpen && <nav className={className}>{children}</nav>}
    </>
  );
}
