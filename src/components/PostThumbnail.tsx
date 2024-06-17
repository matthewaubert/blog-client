import { Link } from 'react-router-dom';
import Image from './Image';
import { PostData } from '../types';
import { decode } from 'he'; // https://www.npmjs.com/package/he
import { format } from 'date-fns/format'; // https://date-fns.org/v3.6.0/docs/format
import parse from 'html-react-parser'; // https://www.npmjs.com/package/html-react-parser

interface PostThumbnailProps {
  data: PostData;
}

export default function PostThumbnail({ data }: PostThumbnailProps) {
  const postUrl = `/posts/${data.slug}`;

  return (
    <article className="grid gap-x-5 lg:gap-x-6 gap-y-2 sm:grid-cols-[1fr_2fr] leading-snug">
      <Link to={postUrl}>
        <Image
          src={data.displayImg?.url ? data.displayImg.url : ''}
          alt=""
          className="aspect-[3_/_2] mb-1 sm:mb-0"
        />
      </Link>
      <div className="flex flex-col gap-2 lg:gap-3 leading-snug">
        <h3 className="sm:-mt-1">
          <Link to={postUrl}>{decode(data.title)}</Link>
        </h3>
        <div className="text-gray-500 flex gap-2 sm:gap-3 items-center">
          <Link to={`/users/${data.user.slug}`}>
            {decode(data.user.username)}
          </Link>
          <p>•</p>
          <time dateTime={data.createdAt}>{format(data.createdAt, 'PPP')}</time>
        </div>
        <div className="line-clamp-3 text-ellipsis">
          {parse(trimString(decode(data.content)))}
        </div>
        <Link
          to={postUrl}
          className="text-sm text-gray-500 underline underline-offset-8"
        >
          Read more
        </Link>
      </div>
    </article>
  );
}

/**
 * If string > 300 chars, return string trimmed to 297 chars + ellipses;
 * else, return given string unaltered
 * @param string
 * @returns
 */
function trimString(string: string) {
  const length = 500;
  return string.length > length
    ? string.substring(0, length - 3) + '...'
    : string;
}
