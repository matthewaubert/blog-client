import { useMemo } from 'react';
import useFetch from '../utils/use-fetch';
import Form from '../components/Form';
import LoadingIndicator from '../components/LoadingIndicator';
import { BASE_URL } from '../config';
import { ApiResponse, CategoryData } from '../types';
import extractErrorMsg from '../utils/extract-error-msg';

export default function CreatePost() {
  const { data, error, loading } = useFetch<ApiResponse<CategoryData[]>>(
    `${BASE_URL}api/categories?sort[name]=asc`,
  );

  const fields = useMemo(() => {
    return data ? getFields(data.data) : [];
  }, [data]);

  return (
    <main>
      {loading && <LoadingIndicator />}
      {error && <p>{error}</p>}
      {data && (
        <Form<ApiResponse>
          fields={fields}
          action={`${BASE_URL}api/posts`}
          method="POST"
          errorExtractor={extractErrorMsg}
          // dataHandler={}
          // successMsg=""
          // navigateTo=""
        />
      )}
    </main>
  );
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
    // publish toggle
  ];
}
