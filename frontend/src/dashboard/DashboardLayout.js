import React from 'react';
import { Link } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/dashboard/bookings">Bookings</Link></li>
          <li><Link to="/dashboard/services">Services</Link></li>
          <li><Link to="/dashboard/availability">Availability</Link></li>
          <li><Link to="/dashboard/settings">Settings</Link></li>
        </ul>
      </nav>
      <div>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
