import { useState, useEffect, useRef } from 'react';
import useFetch from '../utils/use-fetch';
import { useNavigate } from 'react-router-dom';
import ErrorMsg from '../components/ErrorMsg';
import SuccessMsg from '../components/SuccessMsg';
import { BASE_URL } from '../config';

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

export default function SignupPage() {
  const [formData, setFormData] = useState({ ...emptyFormData });
  const [formErrors, setFormErrors] = useState({ ...emptyFormData });
  const [success, setSuccess] = useState(false);
  const passwordRef = useRef<null | HTMLInputElement>(null);
  const { data, error, fetchData } = useFetch();
  const navigate = useNavigate();
  // console.log('formErrors:', formErrors);
  console.log('data:', data || error);

  // 3 seconds after successful form submission, navigate to login page
  useEffect(() => {
    if (success) {
      setTimeout(() => navigate('/login'), 2500);
    }
  }, [navigate, success]);

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
      fetchData(`${BASE_URL}api/users`, 'POST', formData)
        .catch((err) => {
          console.dir(err);
          // TODO: display errors
        })
        .finally(() => {
          // show success message and navigate to login page
          setSuccess(true);
        });
    }
  }

  return (
    <>
      {success && <SuccessMsg />}
      <main className="flex flex-col gap-4">
        <h2>Sign Up</h2>
        <form
          action=""
          method="POST"
          className="grid grid-cols-2 gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="input-container">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              className="input"
              id="firstName"
              name="firstName"
              placeholder="e.g. Sam"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              autoFocus
            />
            {formErrors.firstName && <ErrorMsg msg={formErrors.firstName} />}
          </div>
          <div className="input-container">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              className="input"
              id="lastName"
              name="lastName"
              placeholder="e.g. Smith"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
            {formErrors.lastName && <ErrorMsg msg={formErrors.lastName} />}
          </div>

          <div className="input-container col-span-2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="input"
              id="username"
              name="username"
              placeholder="sam.smith"
              required
              value={formData.username}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
            {formErrors.username && <ErrorMsg msg={formErrors.username} />}
          </div>
          <div className="input-container col-span-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="input"
              id="email"
              name="email"
              placeholder="example@email.com"
              required
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
            {formErrors.email && <ErrorMsg msg={formErrors.email} />}
          </div>

          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              ref={passwordRef}
              type="password"
              className="input"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
            {formErrors.password && <ErrorMsg msg={formErrors.password} />}
          </div>
          <div className="input-container">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              className="input"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
            {formErrors.confirmPassword && (
              <ErrorMsg msg={formErrors.confirmPassword} />
            )}
          </div>

          <button type="submit" className="form-btn col-span-2">
            Sign up
          </button>
        </form>
      </main>
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
