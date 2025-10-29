import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const RegisterLayout: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default RegisterLayout;
