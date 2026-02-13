import React from 'react';
import logoImg from '../../assets/logo-umi.jpg';

export default function Logo({ size = 'md', showText = true }) {
  const sizes = {
    sm: { img: 'w-8 h-8', ring: 'ring-1' },
    md: { img: 'w-12 h-12', ring: 'ring-2' },
    lg: { img: 'w-20 h-20', ring: 'ring-2' },
    xl: { img: 'w-28 h-28', ring: 'ring-2' },
  };
  const s = sizes[size] || sizes.md;
  return (
    <div className="flex items-center gap-3">
      <img
        src={logoImg}
        alt="UMI - Università Magica Internazionale"
        className={`${s.img} rounded-full object-cover ${s.ring} ring-umi-gold/40 shadow-lg shadow-umi-gold/10`}
        draggable={false}
      />
      {showText && (
        <div>
          <div className="small-caps font-bold text-umi-text tracking-widest text-sm">DAMASO FERNANDEZ</div>
          <div className="text-umi-gold text-xs tracking-wider uppercase">Università Magica Internazionale</div>
        </div>
      )}
    </div>
  );
}
