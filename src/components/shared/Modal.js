import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className={`relative ${maxWidth} w-full bg-umi-card border border-umi-primary rounded-xl p-6 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-umi-text tracking-wider uppercase">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-umi-input rounded-lg transition-colors">
            <X size={20} className="text-umi-muted" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
