require('dotenv').config();
const express = require('express');
const pool = require('./config/db');

// Impor file rute
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects'); // <-- TAMBAHKAN INI
const profileRoutes = require('./routes/profiles');
const proposalRoutes = require('./routes/proposals');
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware untuk membaca JSON
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API untuk Hubung.In Berjalan!');
});

// Gunakan Rute
// Semua rute di auth.js akan diawali dengan /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); // <-- TAMBAHKAN INI
app.use('/api/profiles', profileRoutes);
app.use('/api/proposals', proposalRoutes);

app.listen(PORT, () => {
  console.log(`Server berhasil berjalan di port ${PORT}`);
});

