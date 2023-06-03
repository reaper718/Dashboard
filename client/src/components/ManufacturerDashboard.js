import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManufacturerDashboard() {
  const [messages, setMessages] = useState([]);
  const [orderID, setOrderID] = useState('');
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [quantity, setQuantity] = useState('');
  const [address, setAddress] = useState('');
  const [transporter, setTransporter] = useState('');

  const generateOrderID = () => {
    // Generate a random alphanumeric code
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }
    setOrderID(code);
  };

  const fetchMessages = async (user) => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = parseJwt(token);
      const response = await axios.get(`http://localhost:5000/manufacturer/${decodedToken.email}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAddress = () => {
    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    setAddress(decodedToken.address);
  }

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

  useEffect(() => {
    generateOrderID(); // Generate initial Order ID
    fetchMessages();
    fetchAddress();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const decodedToken = parseJwt(token);
      await axios.post(
        'http://localhost:5000/api/messages',
        { orderID, to, from, quantity, address, transporter },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Clear form fields after sending the message
      setOrderID('');
      setTo('');
      setFrom('');
      setQuantity('');
      setAddress(decodedToken.address);
      setTransporter('');
      // Fetch messages again to display the updated list
      fetchMessages();
      // Generate a new Order ID
      generateOrderID();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 text-white p-4">
      <h1 className='text-2xl font-bold mb-4 text-center'>Manufacturer Dashboard</h1>
      </nav>
      <div className='flex m-5'>
      <div className="w-2/3 mr-2"> 
      <h2 className='block ml-2 font-bold text-black-600 text-2xl p-2'>Messages</h2>
        {messages.map((message) => (
          <div key={message._id} className="bg-gray-100 p-4 mb-4 rounded">
            <p className="text-gray-800">Order ID: {message.orderID}</p>
            <p className="text-gray-800">To: {message.to}</p>
            <p className="text-gray-800">From: {message.from}</p>
            <p className="text-gray-800">Quantity: {message.quantity}</p>
            <p className="text-gray-800">Address: {message.address}</p>
            <p className="text-gray-800">Transporter: {message.transporter}</p>
            {message.price && <p className="text-gray-800">Price: {message.price}</p>}
            <hr className="my-2"/>
          </div>
        ))}
      </div>
      <div className='w-1/3 ml-2'>
        <div className='w-96 px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-md'>
          <h2 className='text-2xl font-bold text-center'>Send Message</h2>
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Order ID"
              value={orderID}
              onChange={(e) => setOrderID(e.target.value)}
              required
              className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
            />
            <input
              type="text"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
            />
            <input
              type="text"
              placeholder="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
              className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
            />
            <select
              onChange={(e) => setQuantity(e.target.value)}
              required
              className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
            >
              <option value="">select Quantity</option>
              <option value="1 ton">1 ton</option>
              <option value="2 ton">2 ton</option>
              <option value="3 ton">3 ton</option>
            </select>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              readOnly
              className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
            />
            <select
              onChange={(e) => setTransporter(e.target.value)}
              required
              className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
            >
              <option value="">Transporter</option>
              <option value="transporter 1">Transporter 1</option>
              <option value="transporter 2">Transporter 2</option>
              <option value="transporter 3">Transporter 3</option>
            </select>
            <button
              type="submit"
              className='px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900'
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}

export default ManufacturerDashboard;
