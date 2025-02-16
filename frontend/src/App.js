import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import ClientProfile from'./components/ClientProfile';
import EmployeeDashboard from './components/EmployeeDashboard';
import AgentDashboard from './components/AgentDashboard';
import AdminDashboard from './components/AdminDashboard';
import ChangePassword from './components/ChangePassword';
import PreviousTickets from './components/Employee/PreviousTickets';
import TicketsPage from './components/Admin/TicketsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard-employee" element={<EmployeeDashboard />} />
        <Route path="/dashboard-agent" element={<AgentDashboard />} />
        <Route path="/dashboard-admin" element={<AdminDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/clientProfile" element={<ClientProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/dashboard-employee/previous-tickets" element={<PreviousTickets />} />
        <Route path="/dashboard-admin/all-tickets" element={<TicketsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
