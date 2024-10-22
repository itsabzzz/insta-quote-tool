import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

// Correct the URL in the login form (Login.js or similar)
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Corrected the API route to use /api/auth/login
    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, { email, password });
    const { token, businessId } = response.data;
    localStorage.setItem('token', token);  
    localStorage.setItem('businessId', businessId);
    navigate('/dashboard/bookings'); 
  } catch (err) {
    setError('Invalid credentials');
  }
};


  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
