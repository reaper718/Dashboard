// Registration.js
import React, { useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import axios from 'axios';

const  Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('manufacturer');
  const history = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', { email, password, role, address });
      alert("registration successfull!!!")
    } catch (error) {
      console.error(error);
    }
  };

  const redirectToLogin = () => {
    history('/');
  }

  return (
    <div className='flex items-center justify-center min-h-screen'>
    <div className='px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-md shadow-black-500/50 w-auto'>
      <h1 className='text-2xl font-bold text-center'>Registration</h1>
      <form onSubmit={handleRegistration} action="POST">
        <input type="email" placeholder="Email"  onChange={(e) => setEmail(e.target.value)} required className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'/>
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'/>
        <input type="address" placeholder="Address" onChange={(e) => setAddress(e.target.value)} required className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'/>
        <select onChange={(e) => setRole(e.target.value)} className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'>
          <option value="manufacturer">Manufacturer</option>
          <option value="transporter">Transporter</option>
        </select>
        <div className='flex justify-between items-center'>
        <button type="submit" className='px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900'>Register</button>
        <button onClick={redirectToLogin} className='px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900'>Go to Login Page</button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Registration;
