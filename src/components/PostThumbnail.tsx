import { Link } from 'react-router-dom';
import Image from './Image';
import { PostData } from '../types';
import { decode } from 'he'; // https://www.npmjs.com/package/he
import { format } from 'date-fns/format'; // https://date-fns.org/v3.6.0/docs/format

interface PostThumbnailProps {
  data: PostData;
}

export default function PostThumbnail({ data }: PostThumbnailProps) {
  const postUrl = `posts/${data.slug}`;

  return (
    <div className="grid gap-1">
      <Link to={postUrl}>
        <Image
          src={data.displayImg?.url ? data.displayImg.url : ''}
          alt=""
          className="aspect-[3_/_2] mb-1"
        />
      </Link>
      <h3 className="font-bold text-xl">
        <Link to={postUrl}>{decode(data.title)}</Link>
      </h3>
      <time dateTime={data.createdAt} className="text-gray-400">
        {format(data.createdAt, 'PPP')}
      </time>
      <p>
        by:{' '}
        <Link to={`users/${data.user.slug}`}>{decode(data.user.username)}</Link>
      </p>
      <p className="line-clamp-5 text-ellipsis">
        {trimString(decode(data.content))}
      </p>
      <Link to={postUrl} className="text-sm underline">
        Read more
      </Link>
    </div>
  );
}

/**
 * If string > 300 chars, return string trimmed to 297 chars + ellipses;
 * else, return given string unaltered
 * @param string
 * @returns
 */
function trimString(string: string) {
  const length = 300;
  return string.length > length
    ? string.substring(0, length - 3) + '...'
    : string;
}
