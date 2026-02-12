const { Client } = require('pg');
const fs = require('fs');

const sql = fs.readFileSync('./supabase/migrations/20260212_init.sql', 'utf8');

const configs = [
  { name: 'pooler-session-5432', host: 'aws-0-eu-west-1.pooler.supabase.com', port: 5432, user: 'postgres.jbrnuwnyggtxtzwqnsin' },
  { name: 'pooler-transaction-6543', host: 'aws-0-eu-west-1.pooler.supabase.com', port: 6543, user: 'postgres.jbrnuwnyggtxtzwqnsin' },
  { name: 'direct-5432', host: 'db.jbrnuwnyggtxtzwqnsin.supabase.co', port: 5432, user: 'postgres' },
];

(async () => {
  for (const cfg of configs) {
    const client = new Client({ host: cfg.host, port: cfg.port, user: cfg.user, password: 'SuperMagia2026!', database: 'postgres', ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000 });
    try {
      console.log(`Trying ${cfg.name}...`);
      await client.connect();
      console.log(`Connected via ${cfg.name}! Executing schema...`);
      await client.query(sql);
      console.log('SUCCESS! Schema pushed.');
      await client.end();
      process.exit(0);
    } catch (err) {
      console.log(`  Failed: ${err.message}`);
      try { await client.end(); } catch {}
    }
  }
  console.log('All connection strategies failed.');
  process.exit(1);
})();
