const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/projects
// @desc    Membuat proyek baru
// @access  Private (hanya untuk Klien)
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, category, budget_type, budget_amount, deadline } = req.body;
  const clientId = req.user.id;

  try {
    const newProject = await pool.query(
      `INSERT INTO projects (client_id, title, description, category, budget_type, budget_amount, deadline) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [clientId, title, description, category, budget_type, budget_amount, deadline]
    );
    res.status(201).json(newProject.rows[0]);
  } catch (err) {
    console.error(err.message);
    // Pastikan error konsisten dalam format JSON
    res.status(500).json({ msg: 'Server Error' }); 
  }
});

// @route   GET api/projects
// @desc    Mendapatkan semua proyek yang statusnya 'open'
// @access  Private (semua user yang login)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const allProjects = await pool.query(
      `SELECT
        p.project_id,
        p.title,
        p.description,
        p.category,
        p.budget_type,
        p.budget_amount,
        p.deadline,
        p.created_at,
        u.name as client_name
      FROM 
        projects p
      JOIN 
        users u ON p.client_id = u.user_id
      WHERE 
        p.status = 'open'
      ORDER BY 
        p.created_at DESC`
    );
    res.json(allProjects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/projects/my-projects
// @desc    Mendapatkan semua proyek milik klien yang sedang login
// @access  Private (hanya Klien)
router.get('/my-projects', authMiddleware, async (req, res) => {
  try {
    const projects = await pool.query(
      "SELECT * FROM projects WHERE client_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(projects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;