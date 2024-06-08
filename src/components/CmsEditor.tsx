import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react'; // https://www.tiny.cloud/docs/tinymce/latest/react-ref/
import { Editor as TinyMceEditor } from 'tinymce';
import { getErrorMessage } from '../utils/use-fetch';
import { BASE_URL } from '../config';

interface Props {
  name: string;
  placeholder?: string;
}

// expose CmsEditor to parent component
const CmsEditor = forwardRef(function CmsEditor(props: Props, ref) {
  const editorRef = useRef<TinyMceEditor | null>(null);

  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.getContent(),
    uploadImages: () => editorRef.current?.uploadImages(),
  }));

  return (
    <>
      <Editor
        // TODO: serve up API key from back end
        apiKey="api key here"
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
          // specify a function that is used to replace TinyMCE’s default upload handler
          // https://www.tiny.cloud/docs/tinymce/latest/upload-images/#images_upload_handler
          images_upload_handler: async (blobInfo) => {
            const formData = new FormData();
            formData.append('image', blobInfo.blob(), blobInfo.filename());

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
                throw new Error('Invalid server response');
              }
            } catch (err) {
              console.error(err);
              // Reject with a structured error object as expected by TinyMCE
              return Promise.reject({
                message: getErrorMessage(err) || 'Image upload failed',
                remove: true,
              });
            }
          },
          // use actual filename of image, instead of generating new one each time
          images_reuse_filename: true,
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
    </>
  );
});

export default CmsEditor;
