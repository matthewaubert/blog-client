import { useState, useEffect } from 'react';
import useFetch from '../utils/use-fetch';
import { useNavigate } from 'react-router-dom';
// import ErrorMsg from '../components/ErrorMsg';
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
  const [formData, setFormData] = useState(emptyFormData);
  const [success, setSuccess] = useState(false);
  const { data, fetchData } = useFetch();
  const navigate = useNavigate();
  console.log(data);

  // 3 seconds after successful form submission, navigate to login page
  useEffect(() => {
    if (success) {
      setTimeout(() => navigate('/login'), 2500);
    }
  }, [navigate, success]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) return;

    for (const key in formData) {
      if (Object.hasOwn(formData, key)) {
        if (formData[key as keyof FormData] === undefined) return;
      }
    }

    // send formData to API as POST request
    fetchData(`${BASE_URL}api/users`, 'POST', formData)
      .catch((err) => {
        console.error(err);
        // TODO: display errors
      })
      .finally(() => {
        // show success message and navigate to login page
        setSuccess(true);
      });
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
              autoFocus
            />
            {/* <ErrorMsg msg="" /> */}
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
            />
            {/* <ErrorMsg msg="" /> */}
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
            />
            {/* <ErrorMsg msg="" /> */}
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
            />
            {/* <ErrorMsg msg="" /> */}
          </div>

          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="input"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
            {/* <ErrorMsg msg="" /> */}
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
            />
            {/* <ErrorMsg msg="" /> */}
          </div>

          <button type="submit" className="form-btn col-span-2">
            Sign up
          </button>
        </form>
      </main>
    </>
  );
}
