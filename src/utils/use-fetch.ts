import { useState, useEffect, useCallback, useRef } from 'react';

type Opts<U> = {
  body?: object;
  errorExtractor?: (data: U) => string;
  headers?: HeadersInit;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  mode?: RequestMode;
};

/**
 * Returns an object with the fetched data, error message, loading boolean,
 * and `fetchData` function. If a `resource` is provided, the `fetchData` function
 * will be run automatically. This hook utilizes the Fetch API. Review the
 * [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/fetch) for more info.
 * @param {string} [resource]
 * The resource you with to fetch. If provided, `fetchData` will automatically run.
 * @param {Options} [options] - An object containing any custom settings you want
 * to apply to the request.
 * @param {object} [options.body] - Optional request body object
 * @param {function} [options.errorExtractor] - A function used to pull error messages from your
 * expected fetch response. It should accept the fetch response object and return a string.
 * @param {HeadersInit} [options.headers] - Any headers you want to add to your request,
 * contained within a `Headers` object or an object literal with String values.
 * @param {string} [options.method] - The request method, e.g. `'GET'`, `'POST'`.
 * Defaults to `'GET'`.
 * @param {RequestMode} [options.mode] - The mode you want to use for the request,
 * e.g., `'cors'`, `'no-cors'`, or `'same-origin'`. Defaults to `'cors'`.
 * @returns {object} object w/ 4 properties: `data`, `error`, `loading`, `fetchData`
 * - `data` will not be null if request was successful
 * - `error` will not be null if fetch was unsuccessful
 * - `loading` will be true until fetch request is resolved
 * - `fetchData` is an async function with 3 parameters: `resource`, `method`, `body`.
 * When called, it fetches the desired resource and sets `data`, `error`, and `loading`.
 * - e.g. `{ data: [...], error: null, loading: false, fetchData: function }`
 */
export default function useFetch<T>(
  resource?: string,
  options?: {
    body?: object;
    errorExtractor?: (data: T) => string;
    headers?: HeadersInit;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    mode?: RequestMode;
  },
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const stableOptions = useRef(options);

  const fetchData = useCallback(async (resource: string, options?: Opts<T>) => {
    const bodyJson = options?.body ? JSON.stringify(options.body) : null;

    try {
      const response = await fetch(resource, {
        method: options?.method ?? 'GET', // default to 'GET' if no `method` supplied
        mode: options?.mode ?? 'cors', // default to 'cors' if no `mode` supplied
        // default to json if no `header` supplied
        headers: options?.headers ?? { 'Content-Type': 'application/json' },
        // send `body` arg if supplied, else do not send body
        ...(bodyJson && { body: bodyJson }),
      });

      const data = (await response.json()) as T;

      if (!response.ok) {
        const errorMsg =
          data && options?.errorExtractor
            ? options.errorExtractor(data)
            : `A network error was encountered: status ${response.status}`;

        throw new Error(errorMsg);
      }

      setData(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // only run this if `resource` is provided to `useFetch`
  useEffect(() => {
    if (resource) {
      fetchData(resource, stableOptions.current).catch((err) => {
        console.error(err);
      });
    }
  }, [fetchData, resource]);

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
