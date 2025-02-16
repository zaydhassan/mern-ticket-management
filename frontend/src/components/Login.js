import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.css';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
  
      if (response.data.message === "Login successful") {
        const token = response.data.token;
        const user = response.data.user;
  
        // Ensure token and user are stored correctly
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
  
        if (response.data.role === "Employee") {
          navigate("/dashboard-employee");
        } else if (response.data.role === "Agent") {
          navigate("/dashboard-agent");
        } else if (response.data.role === "Admin") {
          setMessage("Admin role detected. Please login as admin.");
        } else {
          setMessage("Invalid role. Please contact support.");
        }
      } else {
        setMessage(response.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="login-link">
          New user? <Link to="/register">Register now</Link>
        </p>

        <p className="login-link">
          Login as <Link to="/adminlogin">Admin</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
