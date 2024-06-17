import { Link } from 'react-router-dom';
import Image from './Image';
import { PostData } from '../types';
import { decode } from 'he'; // https://www.npmjs.com/package/he
import { format } from 'date-fns/format'; // https://date-fns.org/v3.6.0/docs/format
import parse from 'html-react-parser'; // https://www.npmjs.com/package/html-react-parser

interface Props {
  data: PostData;
}

export default function PostFull({ data }: Props) {
  return (
    <article className="flex flex-col gap-4">
      <div>
        <Image
          src={data.displayImg?.url ? data.displayImg.url : ''}
          alt=""
          className="aspect-[3_/_2] mb-1"
        />
        {(data.displayImg?.attribution || data.displayImg?.source) && (
          <small className="italic text-gray-500">
            {'Image' +
              (data.displayImg?.attribution
                ? ` by ${data.displayImg.attribution}`
                : '') +
              (data.displayImg?.source
                ? ` from ${data.displayImg.source}`
                : '')}
          </small>
        )}
      </div>
      <div>
        <h2>{decode(data.title)}</h2>
        <div className="text-gray-500 flex gap-2 sm:gap-3 items-center mt-1">
          <Link to={`/users/${data.user.slug}`}>
            {decode(data.user.username)}
          </Link>
          <p>•</p>
          <time dateTime={data.createdAt}>{format(data.createdAt, 'PPP')}</time>
        </div>
      </div>
      <div>{parse(decode(data.content))}</div>
    </article>
  );
}
