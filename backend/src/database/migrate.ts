import fs from 'fs';
import path from 'path';
import { pool } from './db';

export const runMigrations = async () => {
  console.log('[Migration] Starting PostgreSQL schema migration...');

  const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at: ${schemaPath}`);
  }

  const sql = fs.readFileSync(schemaPath, 'utf-8');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');

    console.log('[Migration] Database schema migrated successfully.');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Migration Error] Schema migration failed:', err);
    throw err;

  } finally {
    client.release();
  }
};

if (require.main === module) {
  runMigrations()
    .then(() => pool.end())
    .catch(async (err) => {
      console.error('[Migration Fatal Error]', err);
      await pool.end();
      process.exit(1);
    });
}