import { useState } from 'react';
// import ErrorMsg from '../components/ErrorMsg';

const emptyFormData = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function SignupPage() {
  const [formData, setFormData] = useState(emptyFormData);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(`${e.target.name}: ${e.target.value}`);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <main className="flex flex-col gap-4">
      <h2>Sign Up</h2>
      <form action="" method="POST" className="grid grid-cols-2 gap-4">
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
  );
}
