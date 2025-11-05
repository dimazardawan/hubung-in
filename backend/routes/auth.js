const authMiddleware = require('../middleware/authMiddleware');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../config/db'); // .. artinya mundur satu direktori
const bcrypt = require('bcryptjs');

// Rute untuk Registrasi Pengguna
// POST /api/auth/register
router.post('/register', async (req, res) => {
  // Ambil data dari body request
  const { name, email, password, role } = req.body;

  try {
    // 1. Cek apakah email sudah terdaftar
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length > 0) {
      // Jika sudah ada, kirim error
      return res.status(400).json({ msg: 'Email sudah terdaftar' });
    }

    // 2. Enkripsi password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Simpan pengguna baru ke database
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, email',
      [name, email, hashedPassword, role]
    );

    // 4. Kirim respons sukses
    res.status(201).json({ 
        msg: 'Pengguna berhasil dibuat', 
        user: newUser.rows[0] 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ... (kode untuk /register ada di atas sini)

// Rute untuk Login Pengguna
// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Cek apakah pengguna dengan email tersebut ada
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      // JANGAN beri tahu emailnya tidak ada, demi keamanan
      return res.status(400).json({ msg: 'Kredensial tidak valid' });
    }

    // 2. Bandingkan password yang dikirim dengan password di database
    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      // JANGAN beri tahu passwordnya yang salah, demi keamanan
      return res.status(400).json({ msg: 'Kredensial tidak valid' });
    }

    // 3. Jika berhasil, buat JSON Web Token (JWT)
    const payload = {
      user: {
        id: user.rows[0].user_id, // Ambil user_id dari hasil query
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token akan kedaluwarsa dalam 1 jam
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// ... (kode untuk /login ada di atas sini)

// Rute terproteksi untuk mendapatkan data user yang sedang login
// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user.id didapatkan dari middleware setelah token diverifikasi
    const user = await pool.query(
      'SELECT user_id, name, email, role FROM users WHERE user_id = $1',
      [req.user.id]
    );

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;