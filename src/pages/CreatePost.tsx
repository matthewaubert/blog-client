import { useMemo, useState } from 'react';
import useFetch from '../utils/use-fetch';
import Form from '../components/Form';
import LoadingIndicator from '../components/LoadingIndicator';
import { BASE_URL } from '../config';
import { ApiResponse, AuthData, CategoryData, PostData } from '../types';
import extractErrorMsg from '../utils/extract-error-msg';
import { useAuth } from '../utils/auth-utils';
import PostFull from '../components/PostFull';

export default function CreatePost() {
  const { authData } = useAuth();
  const [formData, setFormData] = useState({ ...initFormData(authData) });
  // console.log('formData:', formData);

  const { data, error, loading } = useFetch<ApiResponse<CategoryData[]>>(
    `${BASE_URL}api/categories?sort[name]=asc`,
  );

  const fields = useMemo(() => {
    return data ? getFields(data.data) : [];
  }, [data]);

  function handleFormChange(data: Record<string, string | boolean | string[]>) {
    const displayImgField = Object.keys(data).find((el) =>
      el.startsWith('displayImg'),
    );

    if (displayImgField) {
      // if data has a key of 'displayImg...', restructure data for nested object
      const fieldName = displayImgField.replace('displayImg', '').toLowerCase();
      setFormData((formData) => ({
        ...formData,
        displayImg: {
          ...formData.displayImg,
          [fieldName]: data[displayImgField],
        },
      }));
    } else {
      // else, pass data straight in
      setFormData((formData) => ({ ...formData, ...data }));
    }
  }

  return (
    <main className="flex flex-col gap-4 max-w-screen-2xl">
      <h2>Create a New Post</h2>
      <div className="flex flex-col gap-1">
        <p>
          Craft your post in the editor below and your changes will be reflected
          in the preview.
        </p>
        <p>
          You must be a verified user to actually submit a post. But we hope the
          chance to test out the editor suite will encourage you to join!
        </p>
      </div>
      {loading && <LoadingIndicator />}
      {error && <p>{error}</p>}
      <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2 items-start">
        <div className="h-[86vh] overflow-y-scroll py-2 border-y border-gray-300">
          {data && (
            <Form<ApiResponse<PostData>>
              fields={fields}
              action={`${BASE_URL}api/posts`}
              method="POST"
              errorExtractor={extractErrorMsg}
              onChange={handleFormChange}
              successMsg="Post created!"
              navigateTo="/"
              disabled={!authData}
            />
          )}
        </div>
        <div className="h-[86vh] overflow-y-scroll py-2 border-y border-gray-300">
          <PostFull data={formData} />
        </div>
      </div>
    </main>
  );
}

function initFormData(authData: AuthData | null) {
  return {
    _id: '123',
    title: 'Horizons Test Editor',
    slug: 'horizons-test-editor',
    content:
      'This is the preview content. As you make edits, they will be displayed here.',
    user: authData
      ? authData.user
      : {
          _id: '456',
          firstName: 'Sam',
          lastName: 'Smith',
          username: 'sam.smith',
          slug: 'sam-smith',
          email: 'sam.smith@email.com',
          isVerified: false,
          isAdmin: false,
        },
    isPublished: false,
    category: {
      _id: '789',
      name: 'Food',
      slug: 'food',
    },
    displayImg: {
      attribution: '',
      source: '',
      url: '',
    },
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
  };
}

/**
 * Create form fields based on given `categoriesData` array
 * @param {CategoryData[]} categoriesData - category data from API
 * @returns array of field objects for `Form` component
 */
function getFields(categoriesData: CategoryData[]) {
  return [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      placeholder: 'title of post',
      required: true,
      colSpan: true,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      colSpan: true,
      selectOptions: [
        {
          value: '',
          name: '-- Please select a category --',
          selected: true,
        },
        // map each category to an obj w/ `value` & `name` properties
        ...categoriesData.map((category) => ({
          value: category._id,
          name: category.name,
        })),
      ],
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'array',
      placeholder: 'Add a tag and press Enter',
      colSpan: true,
    },
    {
      name: 'content',
      label: 'Content',
      type: 'editor',
      placeholder: 'Enter post content here...',
      required: true,
      colSpan: true,
    },
    {
      name: 'displayImgUrl',
      label: 'Display Image',
      type: 'file',
      colSpan: true,
    },
    {
      name: 'displayImgAttribution',
      label: 'Image Attribution',
      type: 'text',
      placeholder: 'e.g. Sam Smith',
    },
    {
      name: 'displayImgSource',
      label: 'Image Source',
      type: 'text',
      placeholder: 'e.g. Shutterstock',
    },
    {
      name: 'isPublished',
      label: 'Would you like to publish this post?',
      type: 'toggle',
      colSpan: true,
      height: '30px',
      offColor: '#9ca3af',
      onColor: '#3b82f6',
    },
  ];
}
