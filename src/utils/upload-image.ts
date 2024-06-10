import { getErrorMessage } from './use-fetch';
import { BASE_URL } from '../config';

/**
 * POST image to `/api/images` endpoint of the API.
 * @param file - the image File or Blob to upload
 * @param filename - the image filename
 * @returns a promise that resolves to the image URL or rejects with an error
 */
export default async function uploadImage(file: File | Blob, filename: string) {
  const formData = new FormData();
  formData.append('image', file, filename);

  try {
    const response = await fetch(`${BASE_URL}api/images`, {
      method: 'POST',
      mode: 'cors',
      body: formData,
    });

    if (!response.ok) {
      // if the response status is not OK, throw an error with details
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = (await response.json()) as Record<string, string>;

    if (data.location) {
      return data.location; // resolve with the image URL
    } else {
      // if the response does not contain the expected data
      throw new Error('Invalid server response.');
    }
  } catch (err) {
    console.error(err);
    throw new Error(getErrorMessage(err) || 'Image upload failed.');
  }
}
