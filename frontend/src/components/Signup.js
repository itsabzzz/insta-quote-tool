import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Use the environment variable for the API base URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Correct the URL in the signup form (Signup.js or similar)
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Corrected the API route to use /api/auth/signup
    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`, { email, password });
    const { token, businessId } = response.data;
    localStorage.setItem('token', token);  
    localStorage.setItem('businessId', businessId);
    navigate('/dashboard/bookings'); 
  } catch (err) {
    setError('Signup failed');
  }
};


  return (
    <div>
      <h2>Signup</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Business Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
