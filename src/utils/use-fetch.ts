import { useState, useEffect } from 'react';

/**
 * custom React hook: fetch data from input url
 * @param {string} url - e.g. https://pokeapi.co/api/v2/pokemon
 * @param {string} method - GET, POST, PUT, DELETE, etc. Optional, defaults to 'GET'
 * @param {object} body - optional request body object
 * @returns {object} obj w/ 3 properties: `data`, `error`, `loading`
 * - `data` will not be null if request was successful
 * - `error` will not be null if fetch was unsuccessful
 * - `loading` will be true until fetch request is resolved
 * - e.g. `{ data: [...], error: null, loading: false }`
 */
export default function useFetch<Type>(
  url: string,
  method?: string, // optional, defaults to 'GET'
  body?: object, // optional
): {
  data: Type | null; // should we use a `Type` parameter or `unknown`?
  error: string | null;
  loading: boolean;
} {
  const [data, setData] = useState<Type | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const bodyJson = body ? JSON.stringify(body) : null;

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(url, {
          method: method || 'GET', // default to 'GET' if no `method` supplied
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
    })().catch((err) => {
      console.error(err); // is this the best way to handle this?
    });
  }, [bodyJson, method, url]);

  return { data, error, loading };
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
