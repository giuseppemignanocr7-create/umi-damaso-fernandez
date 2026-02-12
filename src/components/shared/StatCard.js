import React from 'react';

export default function StatCard({ icon, label, value, color = 'umi-primary' }) {
  const colorMap = {
    'umi-primary': 'border-umi-primary text-umi-primary',
    'umi-red': 'border-umi-red text-umi-red',
    'umi-orange': 'border-umi-orange text-umi-orange',
    'umi-green': 'border-umi-green text-umi-green',
    'umi-primary-light': 'border-umi-primary-light text-umi-primary-light',
    'umi-gold': 'border-umi-gold text-umi-gold',
  };
  return (
    <div className={`bg-umi-card border ${colorMap[color]?.split(' ')[0] || 'border-umi-primary'} rounded-xl p-5`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-xs uppercase tracking-wider text-umi-muted">{label}</span>
      </div>
      <div className={`text-3xl font-bold ${colorMap[color]?.split(' ')[1] || 'text-umi-primary'}`}>{value}</div>
    </div>
  );
}
