import React from 'react';

const Quibar = ({ message, size = 'md', animation = 'wave' }) => {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const animations = {
    wave: 'animate-bounce',
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    none: '',
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`${sizes[size]} ${animations[animation]} relative`}>
        <div className="w-full h-full bg-gradient-to-br from-quibar-naranja to-orange-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
          <span className="text-4xl">🦊</span>
        </div>
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-8 bg-quibar-cafe rounded-t-full border-2 border-white"></div>
        </div>
      </div>

      {message && (
        <div className="relative bg-white rounded-xl shadow-lg p-4 max-w-md">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
          
          <p className="text-angostura-gris text-center font-medium relative z-10">
            <span className="text-angostura-turquesa font-bold">Quibar dice:</span>
            <br />
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Quibar;