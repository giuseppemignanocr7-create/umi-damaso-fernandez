import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';

export default function AnimatedPage() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
      <Outlet />
    </div>
  );
}
