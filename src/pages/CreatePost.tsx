import { useEffect, useMemo, useState } from 'react';
import useFetch from '../utils/use-fetch';
import { useAuth, isPayloadExpired } from '../utils/auth-utils';
import Form from '../components/Form';
import PostFull from '../components/PostFull';
import LoadingIndicator from '../components/LoadingIndicator';
import extractErrorMsg from '../utils/extract-error-msg';
import { Link, useParams } from 'react-router-dom'; // https://reactrouter.com/en/6.23.0/hooks/use-params
import { BASE_URL } from '../config';
import { ApiResponse, AuthData, CategoryData, PostData } from '../types';

export default function CreatePost() {
  const { postSlug } = useParams();
  const { authData } = useAuth();
  const payloadIsValid = !isPayloadExpired(authData);
  // init form data with `authData` if payload not expired
  const [formData, setFormData] = useState({
    ...initFormData(payloadIsValid ? authData : null),
  });
  // console.log('formData:', formData);

  const {
    data: categoryData,
    error: categoryError,
    loading: categoryLoading,
  } = useFetch<ApiResponse<CategoryData[]>>(
    `${BASE_URL}api/categories?sort[name]=asc`,
  );

  const fields = useMemo(() => {
    return categoryData ? getFields(categoryData.data) : [];
  }, [categoryData]);

  // conditionally use this hook below to fetch post data if `postSlug` exists
  const {
    data: postData,
    error: postError,
    loading: postLoading,
    fetchData,
  } = useFetch<ApiResponse<PostData>>();

  // if `postSlug`, fetch post data
  useEffect(() => {
    async function initForm() {
      if (postSlug) {
        await fetchData(`${BASE_URL}api/posts/${postSlug}`);
      }
    }

    initForm().catch(console.error);
  }, [postSlug, fetchData]);

  // if `postData`, set form data to post data
  useEffect(() => {
    if (postData) {
      setFormData({ ...postData.data });
    }
  }, [postData]);

  // if `postData`, create `initialValues` object for form
  const initialValues = useMemo(() => {
    if (postData) {
      const { data } = postData;

      return {
        title: data.title,
        category: data.category?._id || '',
        tags: data.tags || [],
        content: data.content,
        isPublished: data.isPublished,
        displayImgUrl: data.displayImg?.url || '',
        displayImgAttribution: data.displayImg?.attribution || '',
        displayImgSource: data.displayImg?.source || '',
      };
    }

    return null;
  }, [postData]);

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
      <h2>{postSlug ? 'Edit Your Post' : 'Create a New Post'}</h2>
      <div className="flex flex-col gap-1">
        <p>
          Craft your post in the editor below and your changes will be reflected
          in the preview.
        </p>
        {!payloadIsValid && (
          <p>
            You must be a verified user to actually submit a post. But we hope
            the chance to test out the editor suite will encourage you to join!
          </p>
        )}
      </div>
      {(categoryLoading || (postSlug && postLoading)) && <LoadingIndicator />}
      {categoryError && <p>{categoryError}</p>}
      {postError && <p>{postError}</p>}
      <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2 items-start">
        <div className="h-[86vh] overflow-y-scroll py-2 border-y border-gray-300">
          {categoryData && (!postSlug || initialValues) && (
            <Form<ApiResponse<PostData>>
              fields={fields}
              initialValues={initialValues}
              action={`${BASE_URL}api/posts` + (postSlug ? `/${postSlug}` : '')}
              method={postSlug ? 'PATCH' : 'POST'}
              errorExtractor={extractErrorMsg}
              onChange={handleFormChange}
              successMsg={postSlug ? 'Post updated!' : 'Post created!'}
              navigateTo="/"
              disabled={!payloadIsValid}
            />
          )}
        </div>
        <div className="h-[86vh] overflow-y-scroll py-2 border-y border-gray-300">
          <PostFull data={formData} />
        </div>
      </div>
      {(!payloadIsValid || !authData?.user.isVerified) && (
        <p>
          Like what you see and want to contribute to Horizons as an author?{' '}
          {!payloadIsValid ? (
            <Link to="/signup" className="login">
              Sign up
            </Link>
          ) : (
            <Link to="/become-author" className="login">
              Become an author
            </Link>
          )}
        </p>
      )}
    </main>
  );
}

/**
 * Generate default form data object to display in preview.
 * @param {object} authData - user data from auth context
 * @returns `PostData` object.
 */
function initFormData(authData: AuthData | null): PostData {
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
        },
    isPublished: false,
    category: {
      _id: '789',
      name: 'Food',
      slug: 'food',
      description: '',
    },
    tags: [],
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
