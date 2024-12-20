// components/NavBar.tsx
import React from 'react';

interface NavBarProps {
  clientId?: string;
}

const NavBar: React.FC<NavBarProps> = ({ clientId }) => {
  return (
    <nav>
      {/* Use the clientId prop as needed */}
      <div>Client ID: {clientId}</div>
    </nav>
  );
}

export default NavBar;