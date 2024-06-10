import { forwardRef, useImperativeHandle, useRef } from 'react';
import useFetch, { getErrorMessage } from '../utils/use-fetch';
import { Editor } from '@tinymce/tinymce-react'; // https://www.tiny.cloud/docs/tinymce/latest/react-ref/
import { Editor as TinyMceEditor } from 'tinymce';
import { BASE_URL } from '../config';
import LoadingIndicator from './LoadingIndicator';
import { getToken } from '../utils/local-storage';
import { useAuth } from '../utils/auth-utils';
import { useNavigate } from 'react-router-dom';
import { ApiResponse } from '../types';

interface Props {
  name: string;
  placeholder?: string;
  uploadImage: (file: Blob, filename: string) => Promise<string>;
}

// expose CmsEditor to parent component
const CmsEditor = forwardRef(function CmsEditor(props: Props, ref) {
  // expose TinyMceEditor methods to parent component
  const editorRef = useRef<TinyMceEditor | null>(null);
  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.getContent(),
    uploadImages: () => editorRef.current?.uploadImages(),
  }));

  // if user not logged in and verified, redirect to home page
  const { authData } = useAuth();
  const navigate = useNavigate();
  if (!authData || !authData.user.isVerified) {
    navigate('/');
  }

  // fetch TinyMCE API key from back end
  const {
    data: apiKey,
    error,
    loading,
  } = useFetch<ApiResponse<string>>(`${BASE_URL}api/api-keys/tinymce`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (error) console.error('Failed to fetch TinyMCE API key: ', error);

  return (
    <>
      {loading && <LoadingIndicator />}
      {error && <p>{error}</p>}
      {apiKey && (
        <Editor
          apiKey={apiKey.data}
          textareaName={props.name}
          onInit={(_evt, editor) => (editorRef.current = editor)}
          initialValue={props.placeholder ? `<p>${props.placeholder}</p>` : ''}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              'anchor',
              'autolink',
              'autosave',
              'charmap',
              'code',
              'fullscreen',
              'help',
              'image',
              'link',
              'lists',
              'advlist', // list styles
              'media',
              'preview',
              'searchreplace',
              'table',
              'visualblocks',
              'wordcount',
            ],
            toolbar:
              'undo redo | blocks | bold italic underline strikethrough | forecolor | ' +
              'align | linkbullist numlist outdent indent table | link image | ' +
              'removeformat | help',
            file_picker_types: 'image', // e.g. 'file image media'
            image_title: true, // enable title field in the Image dialog
            /**
             * Function that is used to replace TinyMCE’s default upload handler.
             * Sends image to back end to be handled and, if successful, gets back its URL.
             * https://www.tiny.cloud/docs/tinymce/latest/upload-images/#images_upload_handler
             * @param blobInfo - Uploaded image blob info
             * @returns Promise that resolves to image URL or rejects as structured error object
             */
            images_upload_handler: async (blobInfo) => {
              try {
                const imageUrl = await props.uploadImage(
                  blobInfo.blob(),
                  blobInfo.filename(),
                );
                return imageUrl; // resolve with the image URL
              } catch (err) {
                console.error(err);
                // Reject with a structured error object as expected by TinyMCE
                return Promise.reject({
                  message: getErrorMessage(err) || 'Image upload failed',
                  remove: true,
                });
              }
            },
            images_reuse_filename: true, // use actual filename of image, instead of generating new one each time
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />
      )}
    </>
  );
});

export default CmsEditor;
