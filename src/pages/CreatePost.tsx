import Form from '../components/Form';
import { BASE_URL } from '../config';
import { ApiResponse } from '../types';
import extractErrorMsg from '../utils/extract-error-msg';

const fields = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'title of post',
    required: true,
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
  // publish checkbox
  // category
  // tags
  // displayImg
];

export default function CreatePost() {
  return (
    <main>
      <Form<ApiResponse>
        fields={fields}
        action={`${BASE_URL}api/posts`}
        method="POST"
        errorExtractor={extractErrorMsg}
        // dataHandler={}
        // successMsg=""
        // navigateTo=""
      />
    </main>
  );
}
