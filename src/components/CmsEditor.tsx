import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react'; // https://www.tiny.cloud/docs/tinymce/latest/react-ref/
import { Editor as TinyMceEditor } from 'tinymce';

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

  // const handleSubmit = async () => {
  //   if (editorRef.current) {
  //     try {
  //       await editorRef.current.uploadImages();

  //       const content = editorRef.current.getContent();
  //       console.log(content);
  //       // POST content to API
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // };

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
            'insertdatetime',
            'insertfile',
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
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          style_formats: [
            { title: 'Heading 1', block: 'h3' },
            { title: 'Heading 2', block: 'h4' },
            { title: 'Heading 3', block: 'h5' },
            { title: 'Block quote', block: 'blockquote' },
            { title: 'Preformatted', block: 'pre' },
            { title: 'Code block', block: 'code' },
          ],
        }}
      />
      {/* <button className="form-btn" onClick={void handleSubmit}>
        Log editor content
      </button> */}
    </>
  );
});

export default CmsEditor;
