import Form from '../components/Form';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config';
import { ApiResponse } from '../types';
import extractErrorMsg from '../utils/extract-error-msg';

const fields = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'Sam',
    required: true,
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Smith',
    required: true,
  },
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'sam.smith',
    required: true,
    colSpan: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'example@email.com',
    required: true,
    minLength: 6,
    colSpan: true,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    minLength: 8,
    required: true,
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    minLength: 8,
    required: true,
  },
];

export default function SignupPage() {
  return (
    <main className="flex flex-col gap-4">
      <h2>Sign Up</h2>
      <Form<ApiResponse>
        fields={fields}
        btnText="Sign up"
        action={`${BASE_URL}api/users`}
        method="POST"
        errorExtractor={extractErrorMsg}
        successMsg="Success!"
        navigateTo="/login"
      />
      <p>
        Already have an account?{' '}
        <Link to="/login" className="login">
          Log in
        </Link>
      </p>
    </main>
  );
}
