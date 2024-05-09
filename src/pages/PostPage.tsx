import { Link, useParams } from 'react-router-dom'; // https://reactrouter.com/en/6.23.0/hooks/use-params
import useFetch from '../utils/use-fetch';
import Image from '../components/Image';
import LoadingIndicator from '../components/LoadingIndicator';
import { BASE_URL } from '../config';
import { ApiResponse, PostData } from '../types';
import { decode } from 'he'; // https://www.npmjs.com/package/he
import { format } from 'date-fns/format'; // https://date-fns.org/v3.6.0/docs/format

export default function PostPage() {
  const { postSlug } = useParams();
  const {
    data: responseData,
    error,
    loading,
  } = useFetch<ApiResponse<PostData>>(`${BASE_URL}api/posts/${postSlug}`);
  console.log(responseData || error || loading);
  const { data } = responseData ?? { data: null };

  return (
    <main className="flex flex-col gap-4">
      {loading && <LoadingIndicator />}
      {error && <p>{error}</p>}
      {data && (
        <article className="grid gap-1">
          <Image
            src={data.displayImg?.url ? data.displayImg.url : ''}
            alt=""
            className="aspect-[3_/_2] mb-1"
          />
          <h3>{decode(data.title)}</h3>
          <time dateTime={data.createdAt} className="text-gray-400">
            {format(data.createdAt, 'PPP')}
          </time>
          <p>
            by:{' '}
            <Link to={`/users/${data.user.slug}`}>
              {decode(data.user.username)}
            </Link>
          </p>
          <p className="">{decode(data.content)}</p>
        </article>
      )}
    </main>
  );
}
