//server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {

});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define schema and models
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['manufacturer', 'transporter'],
    required: true,
  },
});

const messageSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  transporter: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: false,
  },
});



const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, role, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role, address });
    await user.save();
    alert("registration successfull!!!");
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
      alert("Invalid User");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
      alert("Invalid Password");
    }
    const token = jwt.sign({ userId: user._id, role: user.role, email: user.email, address:user.address }, 'secretkey');
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});



// Middleware to verify the token
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secretkey');
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Create a message
app.post('/api/messages', authMiddleware, async (req, res) => {
  try {
    const { orderID, to, from, quantity, address, transporter } = req.body;
    const message = new Message({
      orderID,
      to,
      from,
      quantity,
      address,
      transporter,
    });
    await message.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Get all messages for a specific manufacturer
app.get('/manufacturer/:email/messages', authMiddleware, async (req, res) => {
  try {
    const email = req.params.email;
    const messages = await Message.find({ from: email });
    console.log(messages);
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Get all messages for a specific transporter
app.get('/transporter/:email/messages', authMiddleware, async (req, res) => {
  try {
    const email = req.params.email;
    const messages = await Message.find({ to: email });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Reply to a message with price
app.post('/api/messages/reply',authMiddleware,  async (req, res) => {
  try {
    const { orderID, price } = req.body;
    const message = await Message.findOne({ orderID });
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    message.price = price; // Update the price
    await message.save();
    res.json({ message: 'Reply sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});



// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
