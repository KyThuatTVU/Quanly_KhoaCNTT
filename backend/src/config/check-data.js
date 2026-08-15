import pool from '../database/index.js';

async function check() {
  try {
    const [overview] = await pool.query('SELECT * FROM gioi_thieu_tong_quan');
    console.log('--- gioi_thieu_tong_quan count:', overview.length);
    console.log(overview);

    const [highlights] = await pool.query('SELECT * FROM gioi_thieu_highlights');
    console.log('--- gioi_thieu_highlights count:', highlights.length);
    console.log(highlights);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

check();
