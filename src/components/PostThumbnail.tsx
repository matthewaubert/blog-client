import { PostData } from '../types';
import { decode } from 'he'; // https://www.npmjs.com/package/he
import { format } from 'date-fns'; // https://date-fns.org/
import Icon from '@mdi/react';
import { mdiImageArea } from '@mdi/js'; // https://pictogrammers.com/library/mdi/icon/image-area/

interface PostThumbnailProps {
  data: PostData;
}

export default function PostThumbnail({ data }: PostThumbnailProps) {
  return (
    <div className="px-8 grid gap-1">
      <a href="">
        {data.displayImg?.url ? (
          <img
            src={data.displayImg.url}
            alt=""
            className="aspect-[3_/_2] mb-1"
          />
        ) : (
          <Icon
            path={mdiImageArea}
            color="#9ca3af"
            className="aspect-[3_/_2] mb-1 bg-gray-200"
          />
        )}
      </a>
      <h3 className="font-bold text-xl">
        <a href="">{decode(data.title)}</a>
      </h3>
      <time dateTime={data.createdAt} className="text-gray-400">
        {format(data.createdAt, 'PPP')}
      </time>
      <p>by: {decode(data.user.username)}</p>
      <p className="line-clamp-5 text-ellipsis">
        {trimString(decode(data.content))}
      </p>
      <a href="" className="text-sm underline">
        Read more
      </a>
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
