import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MyNavbar from 'src/components/navigation/Navbar/MyNavbar';

type Props = {};

const Layout = (props: Props) => {
  const location = useLocation();

  return (
    <>
      <MyNavbar
        variant={location.pathname.startsWith('/auth') ? 'auth' : 'default'}
      />
      <div className="min-h-screen bg-thistle bg-opacity-25">
        <div className="mx-auto max-w-7xl ">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
