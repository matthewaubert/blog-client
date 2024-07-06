import { useState } from 'react';
import useFetch from '../utils/use-fetch';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react'; // https://pictogrammers.com/docs/library/mdi/getting-started/react/
import {
  mdiChevronDown,
  mdiCircleEditOutline,
  mdiMinusCircleOutline,
} from '@mdi/js';
import { decode } from 'he'; // https://www.npmjs.com/package/he
import { format } from 'date-fns'; // https://date-fns.org/v3.6.0/docs/format
import { getToken } from '../utils/local-storage';
import extractErrorMsg from '../utils/extract-error-msg';
import { BASE_URL } from '../config';
import { ApiResponse, PostData } from '../types';

interface Props {
  data: PostData;
  editable?: boolean;
}

export default function CmsPostCard({ data }: Props) {
  const { fetchData } = useFetch<ApiResponse<PostData>>();
  const [isOpen, setIsOpen] = useState(false);
  const postUrl = `/posts/${data.slug}`;

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this?')) {
      const token = getToken(); // get JWT from `localStorage`

      if (token) {
        fetchData(`${BASE_URL}api/posts/${data._id}`, {
          errorExtractor: extractErrorMsg,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          method: 'DELETE',
        })
          .catch((error) => console.error('Error deleting post:', error))
          .finally(() => window.location.reload());
      }
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-2 shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th colSpan={2}>
              <div className="flex justify-between">
                <Link to={postUrl}>{decode(data.title)}</Link>
                <button
                  className={'transition-all' + (isOpen ? ' rotate-180' : '')}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Icon
                    path={mdiChevronDown}
                    color=""
                    className="h-7 fill-gray-500 hover:fill-blue-600"
                  />
                </button>
              </div>
            </th>
          </tr>
        </thead>
        {isOpen && (
          <tbody>
            <tr>
              <th scope="row">Category</th>
              <td>{data.category ? data.category.name : 'Uncategorized'}</td>
            </tr>
            <tr>
              <th scope="row">Tags</th>
              <td>{data.tags ? data.tags.join(', ') : 'No tags'}</td>
            </tr>
            <tr>
              <th scope="row">Status</th>
              <td>{data.isPublished ? 'Published' : 'Draft'}</td>
            </tr>
            <tr>
              <th scope="row">Created</th>
              <td>
                <time dateTime={data.createdAt}>
                  {format(data.createdAt, 'PPPp')}
                </time>
              </td>
            </tr>
            <tr>
              <th scope="row">Edited</th>
              <td>
                {data.createdAt === data.updatedAt ? (
                  'Never'
                ) : (
                  <time dateTime={data.updatedAt}>
                    {format(data.updatedAt, 'PPPp')}
                  </time>
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">Image</th>
              <td>{data.displayImg?.url ? 'Has image' : 'No image'}</td>
            </tr>
            <tr>
              <td colSpan={2}>
                <div className="flex gap-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-2 w-fit flex items-center gap-2 transition-all">
                    <Icon
                      path={mdiCircleEditOutline}
                      color=""
                      className="h-6 fill-white"
                    />
                    <span>Edit</span>
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white rounded px-3 py-2 w-fit flex items-center gap-2 transition-all"
                    onClick={handleDelete}
                  >
                    <Icon
                      path={mdiMinusCircleOutline}
                      color=""
                      className="h-6 fill-white"
                    />
                    <span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
