import useFetch from '../utils/use-fetch';
import PostThumbnail from '../components/PostThumbnail';
import LoadingIndicator from '../components/LoadingIndicator';
import { BASE_URL } from '../config';
import { ApiResponse, PostData } from '../types';
import Splash from '../components/Splash';

export default function HomePage() {
  const { data, error, loading } = useFetch<ApiResponse<PostData[]>>(
    `${BASE_URL}api/posts?sort[createdAt]=desc`,
  );
  // console.log(data || error || loading);

  return (
    <>
      <Splash />
      <main className="flex flex-col gap-12 mt-10">
        {loading && <LoadingIndicator color="#bfdbfe" />}
        {error && <p>{error}</p>}
        {data &&
          data.data.map(
            (post) =>
              post.isPublished && <PostThumbnail key={post._id} data={post} />,
          )}
      </main>
    </>
  );
}
