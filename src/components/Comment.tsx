import { decode } from 'he'; // https://www.npmjs.com/package/he
import { format } from 'date-fns'; // https://date-fns.org/v3.6.0/docs/format
import { CommentData } from '../types';

interface Props {
  data: CommentData;
}

export default function Comment({ data }: Props) {
  return (
    <div>
      <time dateTime={data.createdAt} className="text-gray-500 text-sm">
        {format(data.createdAt, 'PPPp')}
      </time>
      <p>
        <strong>{decode(data.user.username)}</strong> says:
      </p>
      <p className="mt-1">{decode(data.text)}</p>
    </div>
  );
}
