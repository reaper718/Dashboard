// MessagesList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [searchOrderID, setSearchOrderID] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [searchFrom, setSearchFrom] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('/api/messages', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchMessages();
  }, []);
  

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/api/messages?orderID=${searchOrderID}&to=${searchTo}&from=${searchFrom}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div>
      <h1>Messages List</h1>
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Search Order ID" value={searchOrderID} onChange={(e) => setSearchOrderID(e.target.value)} />
        <input type="text" placeholder="Search To" value={searchTo} onChange={(e) => setSearchTo(e.target.value)} />
        <input type="text" placeholder="Search From" value={searchFrom} onChange={(e) => setSearchFrom(e.target.value)} />
        <button type="submit">Search</button>
      </form>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <p>Order ID: {message.orderID}</p>
            <p>To: {message.to}</p>
            <p>From: {message.from}</p>
            {/* Display other message details */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesList;
