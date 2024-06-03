import { useState, useEffect, useRef } from 'react';
import useFetch from '../utils/use-fetch';
import { useNavigate } from 'react-router-dom';
import ErrorMsg from '../components/ErrorMsg';
import SubmissionMsg from '../components/SubmissionMsg';
import { getToken } from '../utils/local-storage';

interface Field {
  name: string;
  label?: string;
  type: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  colSpan?: boolean;
}

interface Props<U> {
  className?: string;
  fields?: Field[];
  btnText?: string;
  action: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  errorExtractor?: (data: U) => string;
  dataHandler?: (data: U) => void;
  successMsg?: string;
  navigateTo?: string;
}

/**
 * JSX component for a form meant to submit its data to an API.
 * @param {Props} props
 * @param {object[]} [props.fields] - Optional array of objects defining the fields to display.
 * @param {string} [props.btnText] - Optional text to display within button. Defaults to 'Submit'.
 * @param {string} props.action - The resource to which you want to send the form data.
 * @param {string} props.method - The request method, e.g. `'GET'`, `'POST'`.
 * @param {Function} [props.errorExtractor] - Optional function used to pull error messages from
 * your expected fetch response. It should accept the fetch response object and return a string.
 * @param {Function} [props.dataHandler] - Optional function that is run upon successful submission.
 * It should accept the response object and return nothing.
 * @param {string} [props.successMsg] - Optional message to display on successful form submission.
 * @param {string} [props.navigateTo] - Optional URL to navigate to on successful form submission.
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
  successMsg,
  navigateTo,
}: Props<T>) {
  const formFields = getFormFields(fields);
  const [formData, setFormData] = useState({ ...formFields });
  const [formErrors, setFormErrors] = useState({ ...formFields });
  const passwordRef = useRef<null | HTMLInputElement>(null);
  const { data, error, fetchData } = useFetch<T>();
  const navigate = useNavigate();
  // if (data) console.log('data:', data);

  useEffect(() => {
    // if successful submission
    if (data) {
      // 3 seconds after successful form submission, navigate to given page
      if (navigateTo) {
        setTimeout(() => navigate(navigateTo), 2500);
      }
      if (dataHandler) {
        dataHandler(data);
      }
      // clear form fields
      if (Object.keys(fields).length) {
        setFormData(() => ({ ...getFormFields(fields) }));
      }
    }
  }, [data, navigate, navigateTo, dataHandler, fields]);

  // update formData and clear form error
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  }

  // if field is invalid when it loses focus: set form error
  function handleInputBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { formIsValid, messages } = validateForm(e.target as HTMLFormElement);
    setFormErrors({ ...formErrors, ...messages });

    if (formIsValid) {
      const token = getToken(); // get JWT from `localStorage`

      // send formData to API as POST request
      fetchData(action, {
        // send body if `formData` has any properties
        ...(Object.keys(formData).length && { body: formData }),
        errorExtractor,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          // send "Authorization" header if JWT in `localStorage`
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }).catch((err) => console.dir(err));
    }
  }

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
        onSubmit={handleSubmit}
        noValidate
      >
        {fields.map((field, i) => (
          <div
            key={field.name}
            className={'input-container' + (field.colSpan ? ' col-span-2' : '')}
          >
            {field.label && <label htmlFor={field.name}>{field.label}</label>}
            {field.type !== 'textarea' ? (
              <input
                ref={field.name === 'password' ? passwordRef : undefined}
                type={field.type}
                className={'input' + (formErrors[field.name] && ' error')}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required ?? false}
                value={formData[field.name] ?? ''}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                autoFocus={i === 0}
              />
            ) : (
              <textarea
                className={'input' + (formErrors[field.name] && ' error')}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                rows={field.rows}
                required={field.required ?? false}
                value={formData[field.name] ?? ''}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
            )}
            {formErrors[field.name] && (
              <ErrorMsg msg={formErrors[field.name]} />
            )}
          </div>
        ))}

        <button type="submit" className="form-btn col-span-2">
          {btnText}
        </button>
      </form>
    </>
  );
}

/**
 * Return an object containing a key of `field.name` with the value of an empty string
 * for each object in the given array of `Field` objects
 * @param fields - e.g. `{ { name: 'email', ... }, { name: 'password', ... } }`
 * @returns e.g. `{ email: '', password: '' }`
 */
function getFormFields(fields: Field[]) {
  return fields.reduce(
    (accumulator, field) => {
      accumulator[field.name] = '';
      return accumulator;
    },
    {} as Record<string, string>,
  );
}

/**
 * Check validity of given field. Returns an object containing a `fieldIsValid`
 * boolean property and a `message` string property.
 * @param field - an HTMLInputElement or HTMLTextAreaElement
 * @param passwordField - optional HTMLInputElement password field
 * @returns e.g. `{ fieldIsValid: false, message: 'Please fill out this field.' }`
 */
function validateField(
  field: HTMLInputElement | HTMLTextAreaElement,
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
  const fields: (HTMLInputElement | HTMLTextAreaElement)[] = Array.from(
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
