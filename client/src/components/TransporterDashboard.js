// TransporterDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransporterDashboard() {
  const [messages, setMessages] = useState([]);
  const [selectedOrderID, setSelectedOrderID] = useState('');
  const [price, setPrice] = useState('');

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = parseJwt(token);
      const response = await axios.get(`http://localhost:5000/transporter/${decodedToken.email}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
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

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReplyMessage = async (e, orderID, price) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/messages/reply',
        { orderID: orderID, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Clear form fields after replying to the message
      setSelectedOrderID('');
      setPrice('');
      // Fetch messages again to display the updated list
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className="min-h-screen flex flex-col backColore">
      <nav className="bg-gray-800 text-white p-4">
      <h1 className='text-2xl font-bold mb-4 text-center'>Transporter Dashboard</h1>
      </nav>
      <h2 className='block ml-2 font-bold text-black-600 text-2xl p-5'>Messages</h2>
      {messages.map((message) => (
        <div key={message._id}  className="bg-gray-100 p-5 mb-5 m-5 w-96 rounded">
          <p className="text-gray-800">Order ID: {message.orderID}</p>
          <p className="text-gray-800">To: {message.to}</p>
          <p className="text-gray-800">From: {message.from}</p>
          <p className="text-gray-800">Quantity: {message.quantity}</p>
          <p className="text-gray-800">Address: {message.address}</p>
          <p className="text-gray-800">Transporter: {message.transporter}</p>
          {!message.price && (
            <form
              onSubmit={(e) => {
                handleReplyMessage(e, message.orderID, price);
              }}
            >
              <input
                type="text"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
              />
              <button type="submit" className='px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900'>Reply</button>
            </form>
          )}
          {message.price && <p className="text-gray-800">Price: {message.price}</p>}
          <hr />
        </div>
      ))}
    </div>
  );
}

export default TransporterDashboard;
