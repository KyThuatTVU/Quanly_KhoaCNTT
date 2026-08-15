import pool from '../database/index.js';
import { TABLE_MAP } from '../constants/index.js';

async function check() {
  try {
    console.log('=== TABLE ROW COUNTS ===');
    for (const [key, tableName] of Object.entries(TABLE_MAP)) {
      try {
        const [rows] = await pool.query(`SELECT COUNT(*) as count FROM ??`, [tableName]);
        console.log(`- ${tableName} (${key}): ${rows[0].count} rows`);
      } catch (err) {
        console.log(`- ${tableName} (${key}): ERROR (${err.message})`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

check();
