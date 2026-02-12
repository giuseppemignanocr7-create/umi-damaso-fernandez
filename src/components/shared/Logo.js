import React from 'react';

export default function Logo({ size = 'md', showText = true }) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };
  return (
    <div className="flex items-center gap-3">
      <div className={`${sizes[size]} rounded-full bg-umi-primary flex items-center justify-center font-bold text-white`}>
        UM
      </div>
      {showText && (
        <div>
          <div className="small-caps font-bold text-umi-text tracking-widest text-sm">DAMASO FERNANDEZ</div>
          <div className="text-umi-gold text-xs tracking-wider uppercase">Università Magica Internazionale</div>
        </div>
      )}
    </div>
  );
}
