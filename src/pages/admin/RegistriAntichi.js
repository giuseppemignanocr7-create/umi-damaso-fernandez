import React from 'react';

export default function RegistriAntichi() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase mb-2">Registri Antichi</h1>
      <p className="text-umi-muted text-sm mb-6">Archivio storico dell'Università Magica.</p>
      <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
        <div className="text-5xl mb-4">📜</div>
        <h3 className="text-lg font-bold text-umi-text mb-2">Archivio in Costruzione</h3>
        <p className="text-umi-muted text-sm">I registri antichi saranno disponibili prossimamente.</p>
      </div>
    </div>
  );
}
