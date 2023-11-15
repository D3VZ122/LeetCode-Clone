import React, { useState } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import './styles/login.css';
import { useUser } from './UserContext'; // Import the useUser hook

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser(); // Use the login function from the context
  const [loggedIn, setLoggedIn] = useState(false);

  const check = () => {
    Axios.post('http://localhost:3001/api/check', {
      Username: username,
      Password: password
    })
      .then(response => {
        console.log(response);
        if (response.data.success) {
          login(username); // Call the login function with user data
          setLoggedIn(true);
        } else {
          alert(response.data.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <form className="login-container__background">
      <h3 className="login-container__title">Sign In</h3>
      <div className="mb-3">
        <label className="login-container__label">Username</label>
        <input
          type="text"
          className="form-control login-container__form-control"
          placeholder="Enter Username"
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="login-container__label">Password</label>
        <input
          type="password"
          className="form-control login-container__form-control"
          placeholder="Enter password"
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
          />
          <label className="custom-control-label" htmlFor="customCheck1">
            Remember me
          </label>
        </div>
      </div>
      <div className="d-grid">
        {loggedIn ? (
          <Link
            to="/home"
            className="btn btn-primary login-container__btn-primary"
          >
            Submit
          </Link>
        ) : (
          <button
            type="button"
            className="btn btn-primary login-container__btn-primary"
            onClick={check}
          >
            Submit
          </button>
        )}
      </div>
      <p className="forgot-password text-right login-container__forgot-password">
        {/* Forgot <a href="#">password?</a> */}
      </p>
    </form>
  );
}
