import { useParams } from 'react-router-dom'; // https://reactrouter.com/en/6.23.0/hooks/use-params
import useFetch from '../utils/use-fetch';
import PostFull from '../components/PostFull';
import Comments from '../components/Comments';
import LoadingIndicator from '../components/LoadingIndicator';
import { BASE_URL } from '../config';
import { ApiResponse, PostData } from '../types';

export default function PostPage() {
  const { postSlug = '' } = useParams();
  const {
    data: responseData,
    error,
    loading,
  } = useFetch<ApiResponse<PostData>>(`${BASE_URL}api/posts/${postSlug}`);
  const { data } = responseData ?? { data: null };

  if (error) {
    throw new Error('A post with that name does not exist.');
  }

  return (
    <main className="flex flex-col gap-8 max-w-screen-md">
      {loading && <LoadingIndicator />}
      {data && <PostFull data={data} />}
      <Comments postSlug={postSlug} />
    </main>
  );
}
