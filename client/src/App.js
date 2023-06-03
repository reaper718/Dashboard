// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import components
import Login from './components/Login';
import Registration from './components/Registration';
import ManufacturerDashboard from './components/ManufacturerDashboard';
import TransporterDashboard from './components/TransporterDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path='/manufacturer/:email/messages' element={<ManufacturerDashboard />} />
        <Route path='/transporter/:email/messages' element={<TransporterDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
