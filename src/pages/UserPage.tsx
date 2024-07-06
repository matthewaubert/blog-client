import { useParams } from 'react-router-dom';
import useFetch from '../utils/use-fetch';
import PostThumbnail from '../components/PostThumbnail';
import LoadingIndicator from '../components/LoadingIndicator';
import { BASE_URL } from '../config';
import { ApiResponse, PostData } from '../types';

export default function UserPage() {
  const { userSlug } = useParams();
  const { data, error, loading } = useFetch<ApiResponse<PostData[]>>(
    `${BASE_URL}api/posts?userSlug=${userSlug}&sort[createdAt]=desc`,
  );

  if (error) {
    throw new Error('A user with that name does not exist.');
  }

  return (
    <main className="flex flex-col gap-12">
      {loading && <LoadingIndicator />}
      {data && data.data.length ? (
        <>
          <h2>Posts by {data.data[0].user.username}</h2>
          <div className="flex flex-col gap-8">
            {data.data.map(
              (post) =>
                post.isPublished && (
                  <PostThumbnail key={post._id} data={post} />
                ),
            )}
          </div>
        </>
      ) : (
        <div>This user doesn&apos;t have any published posts.</div>
      )}
    </main>
  );
}
