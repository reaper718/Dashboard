// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      // Determine the role of the logged-in user
      const decodedToken = parseJwt(token);
      const userRole = decodedToken.role;
     

      // Redirect to the appropriate page based on the user's role
      if (userRole === 'manufacturer') {
        history(`/manufacturer/${decodedToken.email}/messages`);
      } else if (userRole === 'transporter') {
        history(`/transporter/${decodedToken.email}/messages`);
      } else {
        // Handle other roles or fallback to a default page
        history('/');
      }
      
    } catch (error) {
      console.error(error);
    }
  };

  // Function to parse the JWT token and extract the role
    const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  };

  const redirectToRegister = () => {
    history('/registration');
  }

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-md shadow-black-500/50 w-auto'>
      <h1 className='text-2xl font-bold text-center'>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email"  onChange={(e) => setEmail(e.target.value)} required className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'/>
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'/>
        <div className='flex justify-between items-center'>
        <button type="submit" className='px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900'>Login</button>
        <button onClick={redirectToRegister} className='px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900'>Go to Registration Page</button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default Login;
