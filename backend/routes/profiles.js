const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/profiles
// @desc    Membuat atau update profil freelancer
// @access  Private (hanya freelancer yang bersangkutan)
router.post('/', authMiddleware, async (req, res) => {
  const { headline, bio, skills, portfolio_links, hourly_rate } = req.body;
  const freelancerId = req.user.id;

  try {
    // Query UPSERT: Insert jika belum ada, Update jika sudah ada.
    // ON CONFLICT(freelancer_id) adalah kuncinya.
    const profile = await pool.query(
      `INSERT INTO profiles (freelancer_id, headline, bio, skills, portfolio_links, hourly_rate)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (freelancer_id) DO UPDATE SET
        headline = EXCLUDED.headline,
        bio = EXCLUDED.bio,
        skills = EXCLUDED.skills,
        portfolio_links = EXCLUDED.portfolio_links,
        hourly_rate = EXCLUDED.hourly_rate,
        updated_at = NOW()
      RETURNING *`,
      [freelancerId, headline, bio, skills, portfolio_links, hourly_rate]
    );
    res.json(profile.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profiles/user/:user_id
// @desc    Melihat profil freelancer berdasarkan user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await pool.query(
      `SELECT u.name, u.email, p.* FROM profiles p 
      JOIN users u ON p.freelancer_id = u.user_id 
      WHERE p.freelancer_id = $1`,
      [req.params.user_id]
    );

    if (profile.rows.length === 0) {
      return res.status(404).json({ msg: 'Profil tidak ditemukan' });
    }
    res.json(profile.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;