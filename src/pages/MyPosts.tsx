import useFetch from '../utils/use-fetch';
import { useAuth } from '../utils/auth-utils';
import CmsPostCard from '../components/CmsPostCard';
import LoadingIndicator from '../components/LoadingIndicator';
import { BASE_URL } from '../config';
import { ApiResponse, PostData } from '../types';
import { useNavigate } from 'react-router-dom';

export default function MyPosts() {
  const navigate = useNavigate();
  const { authData } = useAuth();
  // if user not logged in, redirect to login page
  if (!authData) {
    navigate('/login');
  }

  const { data, error, loading } = useFetch<ApiResponse<PostData[]>>(
    `${BASE_URL}api/posts?userId=${authData?.user._id}&sort[createdAt]=desc`,
  );

  if (error) {
    throw new Error('An error occurred while fetching your posts.');
  }

  return (
    <main className="flex flex-col gap-6 mt-4 md:mt-6">
      <h2>My Posts</h2>
      {loading && <LoadingIndicator />}
      {data && (
        <div className="flex flex-col gap-6">
          {data.data.map((post) => (
            <CmsPostCard key={post._id} data={post} />
          ))}
        </div>
      )}
    </main>
  );
}
