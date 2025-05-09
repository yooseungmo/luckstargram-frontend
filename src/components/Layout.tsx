import React from 'react';
import { Outlet } from 'react-router-dom';
import '../pages/HomePage.css';

const Layout: React.FC = () => (
  <div className="fortune-bg">
    <Outlet />
  </div>
);

export default Layout;