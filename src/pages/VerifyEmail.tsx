// import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetch from '../utils/use-fetch';
import { ApiResponse } from '../types';
import { BASE_URL } from '../config';
import LoadingIndicator from '../components/LoadingIndicator';
import extractErrorMsg from '../utils/extract-error-msg';
import { useAuth } from '../utils/auth-utils';

const fetchOptions = {
  errorExtractor: extractErrorMsg,
  method: 'PATCH',
} as const;

export default function VerifyEmail() {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  // send token as query param to `verification` endpoint
  const { data, error, loading } = useFetch<ApiResponse>(
    `${BASE_URL}api/verification?token=${searchParams.get('token')}`,
    fetchOptions,
  );
  if (data) {
    login(data);
    console.log('data:', data);
  }

  return (
    <main className="flex flex-col gap-4">
      {loading && <LoadingIndicator />}
      {error && (
        <>
          <h2>Error</h2>
          <p>There was an error verifying your email. Please try again.</p>
          <p>{error}</p>
        </>
      )}
      {data && (
        <>
          <h2>Email Verified</h2>
          <p>
            Your email has been verified! When the content management system is
            ready, you&apos;ll be able to write and manage your own blog posts.
          </p>
        </>
      )}
    </main>
  );
}
