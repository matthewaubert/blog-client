import { useState, useEffect, useCallback } from 'react';

/**
 * Custom React hook: fetch data from given resource URL and return an object with relevant info.
 * @param {string} [url] - The resource you with to fetch. If not provided, `fetchData` will not automatically run.
 * @param {string} [method] - GET, POST, PUT, DELETE, etc. Optional, defaults to 'GET'.
 * @param {object} [body] - Optional request body object
 * @returns {object} obj w/ 4 properties: `data`, `error`, `loading`, `fetchData`
 * - `data` will not be null if request was successful
 * - `error` will not be null if fetch was unsuccessful
 * - `loading` will be true until fetch request is resolved
 * - `fetchData` is an async function with 3 parameters: `url`, `method`, `body`. When called,
 * it fetches the desired resource and sets the `data`, `error`, and `loading` values.
 * - e.g. `{ data: [...], error: null, loading: false, fetchData: function }`
 */
export default function useFetch<Type>(
  url?: string, // if not provided, `fetchData` will not automatically run
  method: string = 'GET', // optional, defaults to 'GET'
  body?: object, // optional
) {
  const [data, setData] = useState<Type | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(
    async (url: string, method: string, body?: object) => {
      const bodyJson = body ? JSON.stringify(body) : null;

      try {
        const response = await fetch(url, {
          method: method, // default to 'GET' if no `method` supplied
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          // send `body` arg if supplied, else do not send body
          ...(bodyJson && { body: bodyJson }),
        });

        if (!response.ok)
          throw new Error(
            `A network error was encountered: status ${response.status}`,
          );

        const data = (await response.json()) as Type;
        setData(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // only run this if params are provided to `useFetch`
  useEffect(() => {
    if (url) {
      fetchData(url, method, body).catch((err) => {
        console.error(err);
      });
    }
  }, [fetchData, url, method, body]);

  return { data, error, loading, fetchData };
}

/**
 * get error message from catch block
 * @param {unknown} error
 * @returns {string} - `error.message` if instance of `Error` | stringify `error`
 */
function getErrorMessage(error: unknown): string {
  // return error instanceof Error ? error.message : String(error);
  return toErrorWithMessage(error).message;
}

interface ErrorWithMessage {
  message: string;
}

/**
 * convert input `error` to an `Error` object with `message` property
 * @param {unknown} error
 * @returns {ErrorWithMessage} `Error` object with `message` property
 */
function toErrorWithMessage(error: unknown): ErrorWithMessage {
  if (isErrorWithMessage(error)) return error as ErrorWithMessage;

  try {
    return new Error(JSON.stringify(error));
  } catch {
    // fallback in case there's an error stringifying the error
    // e.g. circular references
    return new Error(String(error));
  }
}

/**
 * check if input is an `Error` object with `message` property
 * @param {unknown} error
 * @returns {boolean} boolean
 */
function isErrorWithMessage(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}
