import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMceEditor } from 'tinymce';

export default function CmsEditor() {
  const editorRef = useRef<TinyMceEditor | null>(null);
  const handleSubmit = async () => {
    if (editorRef.current) {
      try {
        await editorRef.current.uploadImages();

        const content = editorRef.current.getContent();
        console.log(content);
        // POST content to API
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <Editor
        // TODO: serve up API key from back end
        apiKey="api key here"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>Write your post here...</p>"
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
            'align | table linkbullist numlist outdent indent | removeformat | ' +
            'help',
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
      <button className="form-btn" onClick={void handleSubmit}>
        Log editor content
      </button>
    </>
  );
}
