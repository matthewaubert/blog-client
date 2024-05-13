import { useState, useEffect, useRef } from 'react';
import useFetch from '../utils/use-fetch';
import { useNavigate } from 'react-router-dom';
import ErrorMsg from '../components/ErrorMsg';
import SubmissionMsg from '../components/SubmissionMsg';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const emptyFormData: FormData = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

interface Props<U> {
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    colSpan?: boolean;
  }[];
  btnText?: string;
  action: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  errorExtractor?: (data: U) => string;
  successMsg: string;
  navigateTo?: string;
}

/**
 * JSX component for a form meant to submit its data to an API.
 * @param {Props} props
 * @param {object[]} props.fields - Array of objects defining the fields to display
 * @param {string} props.btnText - Text to display within button. Defaults to 'Submit'.
 * @param {string} props.action - The resource to which you want to send the form data
 * @param {string} props.method - The request method, e.g. `'GET'`, `'POST'`.
 * Defaults to `'GET'`.
 * @param {Function} [props.errorExtractor] - A function used to pull error messages from your
 * expected fetch response. It should accept the fetch response object and return a string.
 * @param {string} props.successMsg - Message to display on successful form submission
 * @param {string} [props.navigateTo] - URL to navigate to on successful form submission
 * @returns {JSX.Element}
 */
export default function Form<T>({
  fields,
  btnText,
  action,
  method,
  errorExtractor,
  successMsg,
  navigateTo,
}: Props<T>) {
  const [formData, setFormData] = useState({ ...emptyFormData });
  const [formErrors, setFormErrors] = useState({ ...emptyFormData });
  const passwordRef = useRef<null | HTMLInputElement>(null);
  const { data, error, fetchData } = useFetch<T>();
  const navigate = useNavigate();
  if (data) console.log('data:', data);

  // 3 seconds after successful form submission, navigate to given page
  useEffect(() => {
    if (data && navigateTo) {
      setTimeout(() => navigate(navigateTo), 2500);
    }
  }, [data, navigate, navigateTo]);

  // update formData and clear form error
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  }

  // if field is invalid when it loses focus: set form error
  function handleInputBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { fieldIsValid, message } = validateField(
      e.target,
      passwordRef.current,
    );
    if (message) console.log(`${e.target.name}: ${message}`);

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
      // send formData to API as POST request
      fetchData(action, {
        body: formData,
        errorExtractor,
        method: method,
      }).catch((err) => console.dir(err));
    }
  }

  return (
    <>
      {data && <SubmissionMsg success={true} msg={successMsg} />}
      {!data && error && <SubmissionMsg success={false} msg={error} />}
      <form
        action=""
        method={method}
        className="grid grid-cols-2 gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
        {fields.map((field, i) => (
          <div
            key={field.name}
            className={'input-container' + (field.colSpan ? ' col-span-2' : '')}
          >
            <label htmlFor={field.name}>{field.label}</label>
            <input
              ref={field.name === 'password' ? passwordRef : undefined}
              type={field.type}
              className={
                'input' + (formErrors[field.name as keyof FormData] && ' error')
              }
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required ?? false}
              value={formData[field.name as keyof FormData] ?? ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              autoFocus={i === 0}
            />
            {formErrors[field.name as keyof FormData] && (
              <ErrorMsg msg={formErrors[field.name as keyof FormData]} />
            )}
          </div>
        ))}

        <button type="submit" className="form-btn col-span-2">
          {btnText ?? 'Submit'}
        </button>
      </form>
    </>
  );
}

function validateField(
  field: HTMLInputElement,
  passwordField?: HTMLInputElement | null,
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

function validateForm(form: HTMLFormElement) {
  const fields = Array.from(form.querySelectorAll('input'));
  const passwordField = form.querySelector<HTMLInputElement>(
    'input[name=password]',
  );

  let formIsValid = true;
  const messages: Record<string, string> = {};

  fields.forEach((field) => {
    const { fieldIsValid, message } = validateField(field, passwordField);
    if (message) console.log(`${field.name}: ${message}`);

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
