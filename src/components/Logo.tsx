import React from 'react';

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <img src="/Logo.png" alt="CICES Logo" className="h-10 w-auto object-contain" />
    <span className="font-serif text-2xl font-black tracking-tighter text-white">
      CICES<span className="text-g-bright">EVENTS</span>
    </span>
  </div>
);

export default Logo;