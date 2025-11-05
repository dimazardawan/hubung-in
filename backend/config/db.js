// Memanggil library pg
const { Pool } = require('pg');

// Membuat koneksi ke database menggunakan variabel dari file .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Mengekspor 'pool' agar bisa digunakan oleh file lain
module.exports = pool;