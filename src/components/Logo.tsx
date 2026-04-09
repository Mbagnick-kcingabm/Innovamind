import React from 'react';
import logoImg from '../asset/Innovalogo.png';
import fidakLogo from '../asset/Logo.png';

interface LogoProps {
  className?: string;
  eventTitle?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "", eventTitle }) => {
  const logoSrc = eventTitle === 'FIDAK 2026' ? fidakLogo : logoImg;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={logoSrc}
        alt="Logo"
        className="h-20 sm:h-24 w-auto object-contain"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.35))'
        }}
      />
    </div>
  );
};

export default Logo;