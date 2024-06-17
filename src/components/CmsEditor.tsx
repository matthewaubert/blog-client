import { forwardRef, useImperativeHandle, useRef } from 'react';
import useFetch, { getErrorMessage } from '../utils/use-fetch';
import { Editor } from '@tinymce/tinymce-react'; // https://www.tiny.cloud/docs/tinymce/latest/react-ref/
import { Editor as TinyMceEditor } from 'tinymce';
import LoadingIndicator from './LoadingIndicator';
import { BASE_URL } from '../config';
import { ApiResponse } from '../types';

interface Props {
  name: string;
  placeholder?: string;
  uploadImage: (file: Blob, filename: string) => Promise<string>;
  onChange?: (data: Record<string, string | string[] | boolean>) => void;
}

// expose CmsEditor to parent component
const CmsEditor = forwardRef(function CmsEditor(
  { name, placeholder, uploadImage, onChange }: Props,
  ref,
) {
  // expose TinyMceEditor methods to parent component
  const editorRef = useRef<TinyMceEditor | null>(null);
  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.getContent(),
    uploadImages: () => editorRef.current?.uploadImages(),
  }));

  // fetch TinyMCE API key from back end
  const {
    data: apiKey,
    error,
    loading,
  } = useFetch<ApiResponse<string>>(`${BASE_URL}api/api-keys/tinymce`);

  if (error) console.error('Failed to fetch TinyMCE API key: ', error);

  return (
    <>
      {loading && <LoadingIndicator />}
      {error && <p>{error}</p>}
      {apiKey && (
        <Editor
          apiKey={apiKey.data}
          textareaName={name}
          onInit={(_evt, editor) => (editorRef.current = editor)}
          initialValue={placeholder ? `<p>${placeholder}</p>` : ''}
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
                const imageUrl = await uploadImage(
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
            // ref: https://www.tiny.cloud/blog/textarea-onchange/
            setup: (editor) => {
              editor.on('change', () => {
                if (onChange) {
                  const content = editorRef.current?.getContent();
                  if (content) onChange({ [name]: content });
                }
              });
            },
          }}
        />
      )}
    </>
  );
});

export default CmsEditor;
