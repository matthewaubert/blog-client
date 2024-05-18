import useFetch from '../utils/use-fetch';
import Comment from './Comment';
import Form from './Form';
import { BASE_URL } from '../config';
import { ApiResponse, CommentData } from '../types';
import extractErrorMsg from '../utils/extract-error-msg';

const fields = [
  {
    name: 'comment',
    type: 'textarea',
    placeholder: 'Post a response...',
    rows: 5,
    required: true,
    colSpan: true,
  },
];

interface Props {
  postSlug: string;
}

export default function Comments({ postSlug }: Props) {
  const { data, error } = useFetch<ApiResponse<CommentData[]>>(
    `${BASE_URL}api/posts/${postSlug}/comments`,
  );

  return (
    <section className="flex flex-col gap-2">
      <h3>Comments</h3>
      {error && <p>{error}</p>}
      {data && data.data.length ? (
        data.data.map((comment) => <Comment key={comment._id} data={comment} />)
      ) : (
        <p>Hm, there don&apos;t seem to be any comments on this post yet...</p>
      )}

      <Form<ApiResponse>
        className="mt-3"
        fields={fields}
        btnText="Post response"
        action={`${BASE_URL}api/posts/${postSlug}/comments`}
        method="POST"
        errorExtractor={extractErrorMsg}
        successMsg="Success!"
        // navigateTo={`${BASE_URL}api/posts/${postSlug}`}
      />
    </section>
  );
}
