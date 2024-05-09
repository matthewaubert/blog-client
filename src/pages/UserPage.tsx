import { useParams } from 'react-router-dom';
import useFetch from '../utils/use-fetch';
import PostThumbnail from '../components/PostThumbnail';
import LoadingIndicator from '../components/LoadingIndicator';
import { BASE_URL } from '../config';
import { ApiResponse, PostData } from '../types';

export default function UserPage() {
  const { userSlug } = useParams();
  const { data, error, loading } = useFetch<ApiResponse<PostData[]>>(
    `${BASE_URL}api/posts?sort[createdAt]=desc`,
  );
  // console.log(data || error || loading);

  // filter for all user's posts that are published; default to empty array
  const userPosts =
    data?.data.filter(
      (post) => post.isPublished && post.user.slug === userSlug,
    ) ?? [];
  if (userPosts) console.log(userPosts);

  return (
    <main className="flex flex-col gap-4">
      {loading && <LoadingIndicator />}
      {error && <p>{error}</p>}
      {userPosts.length ? (
        <>
          <h2>Posts by {userPosts[0].user.username}</h2>
          <div className="flex flex-col gap-8">
            {userPosts.map(
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
