import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { exec } from 'child_process';

dotenv.config();

const setup = async () => {
  console.log('🔄 Bat dau thiet lap Co so Du lieu MySQL...');

  // Connect to MySQL server (without selecting DB initially to allow creation)
  const connectionConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true // Allow executing entire schema file at once
  };

  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Da ket noi thanh cong voi MySQL Server.');
  } catch (err) {
    console.error('❌ Khong the ket noi voi MySQL Server:', err.message);
    console.warn('⚠️ Goi y: Hay chac chan rang dich vu MySQL (MYSQL80) da duoc bat va mat khau trong backend/.env la chinh xac.');
    process.exit(1);
  }

  try {
    // Resolve absolute path to schema.sql in project root
    const schemaPath = path.resolve('../schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Khong tim thay file schema.sql tai: ${schemaPath}`);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('📖 Da doc file schema.sql.');

    // Execute schema commands
    console.log('⚙️ Dang tao co so du lieu va 50 bang trong schema.sql...');
    await connection.query(schemaSql);
    console.log('✅ Import schema.sql hoan tat thanh cong!');

    await connection.end();

    // Spawn the seeder process
    console.log('🌱 Dang tu dong nap du lieu mau (seeding)...');
    exec('npm run seed', (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Loi khi chay bo nap du lieu mau (seed):', err);
        return;
      }
      console.log(stdout);
      if (stderr) console.error(stderr);
      console.log('🎉 Thiet lap Co so Du lieu hoan tat 100%!');
    });

  } catch (err) {
    console.error('❌ Loi thiet lap Co so Du lieu:', err.message);
    if (connection) await connection.end();
  }
};

setup();
