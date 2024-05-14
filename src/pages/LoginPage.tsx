import { useAuth } from '../utils/auth-utils';
import Form from '../components/Form';
import { BASE_URL } from '../config';
import extractErrorMsg from '../utils/extract-error-msg';
import { ApiResponse } from '../types';

const fields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'example@email.com',
    required: true,
    colSpan: true,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    minLength: 8,
    required: true,
    colSpan: true,
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  
  return (
    <main className="flex flex-col gap-4">
      <h2>Log In</h2>
      <Form<ApiResponse>
        fields={fields}
        btnText="Log in"
        action={`${BASE_URL}api/login`}
        method="POST"
        errorExtractor={extractErrorMsg}
        dataHandler={login}
        successMsg="You are now logged in."
        navigateTo="/"
      />
    </main>
  );
}
