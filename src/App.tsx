import useFetch from './utils/use-fetch';
import { BASE_URL } from './config';
import { PostsApiResponse } from './types';

export default function App() {
  const { data, error, loading } = useFetch<PostsApiResponse>(
    `${BASE_URL}api/posts`,
  );
  console.log(data || error || loading);

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {data &&
        data.data.map(
          (post) => post.isPublished && <p key={post._id}>{post.title}</p>,
        )}
    </>
  );
}
