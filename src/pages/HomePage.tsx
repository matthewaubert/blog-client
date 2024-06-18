import useFetch from '../utils/use-fetch';
import PostThumbnail from '../components/PostThumbnail';
import LoadingIndicator from '../components/LoadingIndicator';
import Splash from '../components/Splash';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config';
import { ApiResponse, PostData } from '../types';

export default function HomePage() {
  const { data, error, loading } = useFetch<ApiResponse<PostData[]>>(
    `${BASE_URL}api/posts?sort[createdAt]=desc`,
  );
  // console.log(data || error || loading);

  return (
    <>
      <Splash />
      <main className="flex flex-col gap-12 mt-4 md:mt-6">
        <section className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-x-8 gap-y-4 pb-6 -mb-4 border-b border-gray-300">
          <div className="flex flex-col gap-3">
            <h3>
              <Link to="/create-post">Try our Editor Suite!</Link>
            </h3>
            <p className="md:text-lg max-w-[605px]">
              Want to be an author and make your ideas heard? Test out our
              editor suite! It enables you to create, edit, and preview posts as
              they would appear here on Horizons!
            </p>
            <Link
              to="/create-post"
              className="login"
            >
              Check it out
            </Link>
          </div>
          <div>
            <img
              src="https://res.cloudinary.com/dthyqsnfz/image/upload/v1718736048/blogger_b3yy7e.jpg"
              alt=""
            />
          </div>
        </section>

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
