import { useParams } from 'react-router-dom';
import useFetch from '../utils/use-fetch';
import PostThumbnail from '../components/PostThumbnail';
import LoadingIndicator from '../components/LoadingIndicator';
import { BASE_URL } from '../config';
import { ApiResponse, CategoryData, PostData } from '../types';

export default function UserPage() {
  const { categorySlug } = useParams();
  const {
    data: categoryData,
    error: categoryError,
    loading: categoryLoading,
  } = useFetch<ApiResponse<CategoryData>>(
    `${BASE_URL}api/categories/${categorySlug}`,
  );

  if (categoryError) {
    throw new Error('A category with that name does not exist.');
  }

  const {
    data: postData,
    error: postError,
    loading: postLoading,
  } = useFetch<ApiResponse<PostData[]>>(
    `${BASE_URL}api/posts?categorySlug=${categorySlug}&sort[createdAt]=desc`,
  );

  return (
    <main className="flex flex-col gap-4">
      {(categoryLoading || postLoading) && <LoadingIndicator />}
      {postError && <p>{postError}</p>}

      {categoryData && <h2>Category: {categoryData.data.name}</h2>}
      {postData && postData.data.length ? (
        <div className="flex flex-col gap-12">
          {postData.data.map(
            (post) =>
              post.isPublished && <PostThumbnail key={post._id} data={post} />,
          )}
        </div>
      ) : (
        <div>This category doesn&apos;t have any published posts.</div>
      )}
    </main>
  );
}
