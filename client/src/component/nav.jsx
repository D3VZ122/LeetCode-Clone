import React from "react";
import { Link } from "react-router-dom";
import './styles/navbar.css';
import { useUser } from './UserContext'; // Import the useUser hook

export default function Nav() {
  const { user, logout } = useUser(); // Destructure the logout function

  return (
    <div className="navbar">
      <ul>
        <li>
          <Link to="/home">
            <img src={require("./styles/th.jpg")} height="80cm" width="80cm" alt="Not available" />
          </Link>
        </li>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/problem">Problem</Link>
        </li>
        {user && user.isLoggedIn ? (
          <li>
            <span>Welcome, {user.username}!</span>
            <Link to="/" onClick={logout}>Logout</Link> {/* Call the logout function on click */}
          </li>
        ) : (
          <li>
            <Link to="/">Login</Link>
          </li>
        )}
      </ul>
    </div>
  );
}
