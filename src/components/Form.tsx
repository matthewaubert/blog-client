import { useState, useEffect, useRef } from 'react';
import useFetch from '../utils/use-fetch';
import { useNavigate } from 'react-router-dom';
import ErrorMsg from '../components/ErrorMsg';
import SubmissionMsg from '../components/SubmissionMsg';
import ArrayInput from './ArrayInput';
import Toggle from './Toggle';
import CmsEditor from './CmsEditor';
import { Editor as TinyMceEditor } from 'tinymce';
import { getToken } from '../utils/local-storage';
import uploadImage from '../utils/upload-image';

type HTMLFormFieldElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

interface Field {
  name: string;
  label?: string;
  type: string; // e.g. 'text', 'textarea', 'select', 'toggle', 'file', 'array', 'editor'
  placeholder?: string;
  rows?: number; // 'textarea' type
  required?: boolean;
  colSpan?: boolean;
  selectOptions?: {
    value: string;
    name: string;
    selected?: boolean;
  }[]; // 'select' type
  height?: string; // 'toggle' type
  offColor?: string; // 'toggle' type
  onColor?: string; // 'toggle' type
}

interface Props<U> {
  className?: string;
  fields?: Field[];
  btnText?: string;
  action: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  errorExtractor?: (data: U) => string;
  dataHandler?: (data: U) => void;
  onChange?: (data: Record<string, string | string[] | boolean>) => void;
  successMsg?: string;
  navigateTo?: string;
  disabled?: boolean;
}

/**
 * JSX component for a form meant to submit its data to an API.
 * @param {Props} props
 * @param {object[]} [props.fields] - Optional array of objects defining the fields to display.
 * @param {string} [props.btnText] - Optional text to display within button. Defaults to 'Submit'.
 * @param {string} props.action - The resource to which you want to send the form data.
 * @param {string} props.method - The request method, e.g. `'GET'`, `'POST'`.
 * @param {function} [props.errorExtractor] - Optional function used to pull error messages from
 * your expected fetch response. It should accept the fetch response object and return a string.
 * @param {function} [props.dataHandler] - Optional function that is run upon successful submission.
 * It should accept the response object and return nothing.
 * @param {function} [props.onChange] - Optional function that is run on any field change
 * @param {string} [props.successMsg] - Optional message to display on successful form submission.
 * @param {string} [props.navigateTo] - Optional URL to navigate to on successful form submission.
 * @param {boolean} [disabled] - Optionally disable form submission
 * @returns {JSX.Element}
 */
export default function Form<T>({
  className,
  fields = [],
  btnText = 'Submit',
  action,
  method,
  errorExtractor,
  dataHandler,
  onChange,
  successMsg,
  navigateTo,
  disabled = false,
}: Props<T>) {
  const { initFormData, initFormErrors } = initFormFields(fields);
  const [formData, setFormData] = useState({ ...initFormData });
  const [formErrors, setFormErrors] = useState({ ...initFormErrors });
  const passwordRef = useRef<null | HTMLInputElement>(null);
  const editorRef = useRef<TinyMceEditor | null>(null);
  const { data, error, fetchData } = useFetch<T>();
  const navigate = useNavigate();
  // if (data) console.log('data:', data);

  useEffect(() => {
    // if successful submission
    if (data) {
      // 2 seconds after successful form submission, navigate to given page
      if (navigateTo) {
        setTimeout(() => navigate(navigateTo), 2000);
      }
      if (dataHandler) {
        dataHandler(data);
      }
      // clear form fields
      if (Object.keys(fields).length) {
        setFormData(() => ({ ...initFormFields(fields).initFormData }));
      }
    }
  }, [data, navigate, navigateTo, dataHandler, fields]);

  // update formData and clear form error
  function handleInputChange(e: React.ChangeEvent<HTMLFormFieldElement>) {
    const { name, value, type } = e.target;
    const updatedFormData = {
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    };

    // set field value (or set to boolean `checked` value if it's a checkbox)
    setFormData({ ...formData, ...updatedFormData });
    setFormErrors({ ...formErrors, [name]: '' }); // reset error for current field
    if (onChange) onChange(updatedFormData);
  }

  function handleArrayInputChange(name: string, value: string[]) {
    const updatedFormData = { [name]: value };
    setFormData({ ...formData, ...updatedFormData });
    setFormErrors({ ...formErrors, [name]: '' });
    if (onChange) onChange(updatedFormData);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, files } = e.target;
    if (files && files[0]) {
      try {
        const imageUrl = await uploadImage(files[0], files[0].name);
        const updatedFormData = { [name]: imageUrl };
        setFormData({ ...formData, ...updatedFormData });
        setFormErrors({ ...formErrors, [name]: '' });
        if (onChange) onChange(updatedFormData);
      } catch (err) {
        setFormErrors({ ...formErrors, [name]: 'Image upload failed.' });
      }
    }
  }

  // if field is invalid when it loses focus: set form error
  function handleInputBlur(e: React.FocusEvent<HTMLFormFieldElement>) {
    const { fieldIsValid, message } = validateField(
      e.target,
      passwordRef.current,
    );
    // if (message) console.log(`${e.target.name}: ${message}`);

    setFormErrors({
      ...formErrors,
      // if field is invalid and there's a message: set form error; else: clear form error
      [e.target.name]: !fieldIsValid && message ? message : '',
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) return; // don't allow submission if form is disabled

    const { formIsValid, messages } = validateForm(e.target as HTMLFormElement);
    setFormErrors({ ...formErrors, ...messages });

    if (formIsValid) {
      const token = getToken(); // get JWT from `localStorage`
      // get editor data and save to editorField['fieldName']
      const editorData = await getEditorContent(editorRef, fields);
      const combinedData = { ...formData, ...editorData };

      // send formData to API as POST request
      fetchData(action, {
        // send body if `formData` has any properties or `editorData` exists
        ...(Object.keys(combinedData).length && { body: combinedData }),
        errorExtractor,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          // send "Authorization" header if JWT in `localStorage`
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }).catch(console.error);
    }
  }

  // console.log('formData:', formData);

  return (
    <>
      {data && successMsg && <SubmissionMsg success={true} msg={successMsg} />}
      {!data && error && <SubmissionMsg success={false} msg={error} />}
      <form
        action=""
        method={method}
        className={
          (fields.length ? 'grid grid-cols-2 gap-4' : '') +
          (className ? ` ${className}` : '')
        }
        onSubmit={(e) => {
          handleSubmit(e).catch(console.error);
        }}
        noValidate
      >
        {fields.map((field, i) => (
          <div
            key={field.name}
            className={'input-container' + (field.colSpan ? ' col-span-2' : '')}
          >
            {field.label && field.type !== 'toggle' && (
              <label htmlFor={field.name}>{field.label}</label>
            )}
            {field.type === 'editor' ? (
              <CmsEditor
                name={field.name}
                placeholder="Write your post here..."
                uploadImage={uploadImage}
                onChange={onChange}
                ref={editorRef}
              />
            ) : field.type === 'array' ? (
              <ArrayInput
                className={'input' + (formErrors[field.name] && ' error')}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required ?? false}
                value={formData[field.name] as string[]}
                onChange={handleArrayInputChange}
                onBlur={handleInputBlur}
              />
            ) : field.type === 'file' ? (
              <input
                type="file"
                className={formErrors[field.name] && ' error'}
                id={field.name}
                name={field.name}
                required={field.required ?? false}
                onChange={(e) => {
                  handleFileChange(e).catch(console.error);
                }}
              />
            ) : field.type === 'toggle' ? (
              <Toggle
                label={field.label}
                labelClassName="input-container"
                toggleClassName={
                  'self-start' + (formErrors[field.name] && ' error')
                }
                id={field.name}
                name={field.name}
                required={field.required ?? false}
                checked={formData[field.name] as boolean}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                height={field.height}
                offColor={field.offColor}
                onColor={field.onColor}
              />
            ) : field.type === 'select' ? (
              <select
                className={'input' + (formErrors[field.name] && ' error')}
                id={field.name}
                name={field.name}
                required={field.required ?? false}
                value={formData[field.name] as string}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              >
                {field.selectOptions &&
                  field.selectOptions.map((option) => (
                    <option key={option.name} value={option.value}>
                      {option.name}
                    </option>
                  ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                className={'input' + (formErrors[field.name] && ' error')}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                rows={field.rows}
                required={field.required ?? false}
                value={formData[field.name] as string}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
            ) : (
              <input
                ref={field.name === 'password' ? passwordRef : undefined}
                type={field.type}
                className={'input' + (formErrors[field.name] && ' error')}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required ?? false}
                value={formData[field.name] as string}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                autoFocus={i === 0}
              />
            )}
            {formErrors[field.name] && (
              <ErrorMsg msg={formErrors[field.name]} />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="form-btn col-span-2"
          disabled={disabled}
          style={
            disabled
              ? { backgroundColor: '#9ca3af', cursor: 'not-allowed' }
              : undefined
          }
        >
          {btnText}
        </button>
      </form>
    </>
  );
}

/**
 * Return an object containing `initFormData` and `initFormErrors` objects.
 * Both contain a property for each object in the given array of `fields`,
 * with a key of the `field.name`.
 * - `initFormData` property values are empty strings and/or empty arrays of strings.
 * - `initFormErrors` property values are always empty strings.
 * @param fields - e.g. `{ { name: 'title', ... }, { name: 'tags', ... } }`
 * @returns e.g. `{
 *   initFormData: { title: '', tags: [] },
 *   initFormErrors: { title: '', tags: '' }
 * }`
 */
function initFormFields(fields: Field[]) {
  const initFormData = {} as Record<string, string | string[] | boolean>;
  const initFormErrors = {} as Record<string, string>;

  fields.forEach((field) => {
    switch (field.type) {
      case 'array':
        initFormData[field.name] = [];
        break;
      case 'toggle':
        initFormData[field.name] = false;
        break;
      default:
        initFormData[field.name] = '';
    }

    initFormErrors[field.name] = '';
  });

  return { initFormData, initFormErrors };
}

/**
 * Check validity of given field. Returns an object containing a `fieldIsValid`
 * boolean property and a `message` string property.
 * @param field - HTMLInputElement || HTMLTextAreaElement || HTMLSelectElement
 * @param passwordField - optional HTMLInputElement password field
 * @returns e.g. `{ fieldIsValid: false, message: 'Please fill out this field.' }`
 */
function validateField(
  field: HTMLFormFieldElement,
  passwordField?: HTMLInputElement | null | undefined,
) {
  let fieldIsValid = field.validity.valid;
  let message = field.validationMessage;

  // if it's the `passwordConfirm` field and doesn't match `password` field:
  // mark field invalid and create validation message
  if (
    field.name === 'confirmPassword' &&
    field.value !== passwordField?.value
  ) {
    fieldIsValid = false;
    message = 'Password confirmation must match password.';
  }

  return { fieldIsValid, message };
}

/**
 * Check validity of each field in given form. Returns an object containing a `formIsValid`
 * boolean property and a `messages` object containing a string property for each field.
 * @param form - an HTMLFormElement
 * @returns e.g. `{
 *   formIsValid: false,
 *   messages: {
 *     email: 'Please fill out this field.',
 *     password: 'Please fill out this field.'
 *   }
 * }`
 */
function validateForm(form: HTMLFormElement) {
  const fields: HTMLFormFieldElement[] = Array.from(
    form.querySelectorAll('input, textarea'),
  );
  const passwordField = form.querySelector<HTMLInputElement>(
    'input[name=password]',
  );

  let formIsValid = true;
  const messages: Record<string, string> = {};

  fields.forEach((field) => {
    const { fieldIsValid, message } = validateField(field, passwordField);
    // if (message) console.log(`${field.name}: ${message}`);

    if (!fieldIsValid && message) {
      // add message
      messages[field.name] = message;
      formIsValid = false;
    } else {
      // clear message
      messages[field.name] = '';
    }
  });

  return { formIsValid, messages };
}

/**
 * Get TinyMCE editor content, if any.
 * @param ref - React ref
 * @param fields array of `Field` objects
 * @returns
 */
async function getEditorContent(
  ref: React.MutableRefObject<TinyMceEditor | null>,
  fields: Field[],
) {
  const editorFieldName = getEditorFieldName(fields);

  if (ref.current && editorFieldName) {
    try {
      await ref.current.uploadImages();
      return { [editorFieldName]: ref.current.getContent() };
    } catch (err) {
      console.error(err);
    }
  }

  return null;
}

/**
 * Find name of editor field, if any.
 * @param fields - array of `Field` objects
 * @returns
 */
function getEditorFieldName(fields: Field[]) {
  const editorField = fields.find((field) => field.type === 'editor');
  return editorField?.name ?? null;
}
