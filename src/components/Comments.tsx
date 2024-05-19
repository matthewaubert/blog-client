import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../utils/auth-utils';
import useFetch from '../utils/use-fetch';
import Comment from './Comment';
import Form from './Form';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config';
import { ApiResponse, CommentData } from '../types';
import extractErrorMsg from '../utils/extract-error-msg';

const fields = [
  {
    name: 'text',
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
  const { authData } = useAuth();
  const { data, error } = useFetch<ApiResponse<CommentData[]>>(
    `${BASE_URL}api/posts/${postSlug}/comments`,
  );
  const [newComments, setNewComments] = useState<CommentData[]>([]);

  const dataHandler = useCallback(
    (data: ApiResponse<CommentData>) =>
      setNewComments((nc) => [...nc, data.data]),
    [setNewComments],
  );

  // array of fetched comments and newly-submitted comments
  const allComments = useMemo(() => {
    const fetchedData = data?.data ?? [];
    return [...fetchedData, ...newComments];
  }, [data, newComments]);
  // console.log('all comments:', allComments);

  return (
    <section className="flex flex-col gap-4">
      <h3>Comments</h3>
      {error && <p>{error}</p>}
      {allComments.length ? (
        allComments.map((comment) => (
          <Comment key={comment._id} data={comment} />
        ))
      ) : (
        <p>Hm, there don&apos;t seem to be any comments on this post yet...</p>
      )}

      {authData ? (
        <Form<ApiResponse<CommentData>>
          className="mt-4"
          fields={fields}
          btnText="Post response"
          action={`${BASE_URL}api/posts/${postSlug}/comments`}
          method="POST"
          errorExtractor={extractErrorMsg}
          dataHandler={dataHandler}
          navigateTo={window.location.pathname}
        />
      ) : (
        <p className="mt-4">
          Create an account to write a response.
          <br />
          Already have an account?{' '}
          <Link to="/login" className="login">
            Log in
          </Link>
        </p>
      )}
    </section>
  );
}
