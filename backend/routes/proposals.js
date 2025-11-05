const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/proposals/:projectId
// @desc    Mengirim proposal untuk sebuah proyek
// @access  Private (hanya untuk Freelancer)

router.get('/:projectId', authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const clientId = req.user.id;

  try {
    // 1. Otorisasi: Pastikan user yang request adalah pemilik proyek
    const project = await pool.query(
      'SELECT * FROM projects WHERE project_id = $1 AND client_id = $2',
      [projectId, clientId]
    );

    if (project.rows.length === 0) {
      return res.status(403).json({ msg: 'Akses ditolak: Anda bukan pemilik proyek ini.' });
    }

    // 2. Jika otorisasi berhasil, ambil semua proposal untuk proyek tsb
    const proposals = await pool.query(
      `SELECT 
        prop.proposal_id, 
        prop.proposal_text, 
        prop.bid_amount, 
        prop.status,
        u.user_id as freelancer_id,
        u.name as freelancer_name,
        prof.headline as freelancer_headline
      FROM proposals prop
      JOIN users u ON prop.freelancer_id = u.user_id
      LEFT JOIN profiles prof ON u.user_id = prof.freelancer_id
      WHERE prop.project_id = $1
      ORDER BY prop.created_at ASC`,
      [projectId]
    );
    
    res.json(proposals.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/:projectId', authMiddleware, async (req, res) => {
  const { proposal_text, bid_amount } = req.body;
  const { projectId } = req.params;
  const freelancerId = req.user.id;

  try {
    // Cek dulu apakah proyeknya ada dan masih open
    const project = await pool.query("SELECT * FROM projects WHERE project_id = $1 AND status = 'open'", [projectId]);
    if (project.rows.length === 0) {
      return res.status(404).json({ msg: 'Proyek tidak ditemukan atau sudah tidak open' });
    }

    // Simpan proposal baru
    const newProposal = await pool.query(
      `INSERT INTO proposals (project_id, freelancer_id, proposal_text, bid_amount) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [projectId, freelancerId, proposal_text, bid_amount]
    );

    res.status(201).json(newProposal.rows[0]);
  } catch (err) {
    // Cek jika error disebabkan oleh unique constraint (sudah pernah melamar)
    if (err.code === '23505') {
      return res.status(400).json({ msg: 'Anda sudah pernah mengirim proposal untuk proyek ini' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// ... (kode untuk GET /:projectId ada di atas sini)

// @route   GET api/proposals/my-proposals
// @desc    Mendapatkan semua proposal milik freelancer yang sedang login
// @access  Private (hanya Freelancer)
router.get('/my-proposals', authMiddleware, async (req, res) => {
  try {
    const proposals = await pool.query(
      `SELECT p.*, pr.title as project_title 
       FROM proposals p
       JOIN projects pr ON p.project_id = pr.project_id
       WHERE p.freelancer_id = $1 
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json(proposals.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;