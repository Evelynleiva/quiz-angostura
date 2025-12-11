// src/components/common/Quibar.jsx
import React from 'react';

const Quibar = ({
  message,
  size = 'md',
  animationVariant = 'idle', // 'idle' | 'bounce' | 'float' | 'celebra' | 'none'
}) => {
  const sizes = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56',
  };

  const animations = {
    idle: 'motion-safe:animate-idle-quibar',
    bounce: 'motion-safe:animate-bounce-soft',
    float: 'motion-safe:animate-float-soft',
    celebra: 'motion-safe:animate-quibar-celebra',
    wiggle: 'motion-safe:animate-wiggle',
    none: '',
  };

  const sizeClass = sizes[size] || sizes.md;
  const animationClass = animations[animationVariant] || animations.idle;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Quibar sin círculo rígido, con glow suave */}
      <div className={`relative ${sizeClass} ${animationClass}`}>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-cyan-300/40 blur-2xl" />

        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src="/QUIBAR.png"
            alt="Quibar"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>

        <div className="pointer-events-none absolute -top-3 -right-3 text-2xl motion-safe:animate-ping">
          ✨
        </div>
        <div className="pointer-events-none absolute -bottom-3 -left-3 text-xl motion-safe:animate-bounce">
          ⭐
        </div>
      </div>

      {message && (
        <div className="relative max-w-md rounded-2xl border border-angostura-cielo bg-white/90 px-5 py-4 shadow-xl">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-angostura-cielo" />
          </div>

          <p className="text-angostura-gris text-center leading-relaxed">
            <span className="block text-xl font-bold bg-gradient-to-r from-angostura-turquesa to-purple-600 bg-clip-text text-transparent mb-1">
              ¡Quibar dice!
            </span>
            <span className="text-base">{message}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Quibar;

