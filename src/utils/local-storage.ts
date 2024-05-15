// MDN reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

import { decodeToken, isPayloadExpired } from './auth-utils';

/**
 * Check if storage of given type is available. Return boolean value.
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API).
 * @param {string} type - Type of storage to check for
 * @returns {boolean}
 */
export function isStorageAvailable(type: string) {
  let storage;
  try {
    storage = window[type as keyof WindowLocalStorage];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);

    return true;
  } catch (err) {
    return (
      (err instanceof DOMException &&
        // everything except Firefox
        (err.code === 22 ||
          // Firefox
          err.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          err.name === 'QuotaExceededError' ||
          // Firefox
          err.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0) ??
      false
    );
  }
}

/**
 * If there's a valid token in localStorage: return the decoded payload from the token.
 * If there's an invalid token in `localStorage`: remove it and return `null`.
 * Else: return `null`.
 * @returns {JwtPayload | null}
 */
export function getJwtPayload() {
  if (isStorageAvailable('localStorage')) {
    const token = localStorage.getItem('token');
    const authData = decodeToken(token);

    if (authData && !isPayloadExpired(authData)) {
      return authData;
    } else {
      localStorage.removeItem('token');
    }
  }

  return null;
}
