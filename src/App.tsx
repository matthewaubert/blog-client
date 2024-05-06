import useFetch from './utils/use-fetch';
import Header from './components/Header';
import PostThumbnail from './components/PostThumbnail';
import { BASE_URL } from './config';
import { PostsApiResponse } from './types';

export default function App() {
  const { data, error, loading } = useFetch<PostsApiResponse>(
    `${BASE_URL}api/posts?sort[createdAt]=desc`,
  );
  console.log(data || error || loading);

  return (
    <>
      <Header />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {data && (
        <main className="flex flex-col gap-8">
          {data.data.map(
            (post) =>
              post.isPublished && <PostThumbnail key={post._id} data={post} />,
          )}
        </main>
      )}
    </>
  );
}
