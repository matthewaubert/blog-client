import Icon from '@mdi/react';
import { mdiImageArea } from '@mdi/js'; // https://pictogrammers.com/library/mdi/icon/image-area/

interface ImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

/**
 * JSX component for displaying `<img>` tag, with a placeholder if no `src` is provided
 * @param {object} props
 * @param {string} [props.src]
 * @param {string} [props.alt]
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export default function Image({ src, alt, className }: ImageProps) {
  return src ? (
    <img src={src} alt={alt ? alt : ''} className={className} />
  ) : (
    <Icon
      path={mdiImageArea}
      color="#9ca3af"
      className={`${className} bg-gray-200`}
    />
  );
}
