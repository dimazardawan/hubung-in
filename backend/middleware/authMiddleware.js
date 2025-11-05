const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Ambil token dari header request
  const token = req.header('x-auth-token');

  // 2. Cek jika tidak ada token
  if (!token) {
    return res.status(401).json({ msg: 'Akses ditolak, tidak ada token' });
  }

  // 3. Verifikasi token
  try {
    // Coba dekripsi token menggunakan JWT_SECRET kita
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Jika berhasil, 'decoded' akan berisi payload (data user)
    // Kita sisipkan data user tersebut ke dalam objek request
    req.user = decoded.user;
    
    // Lanjutkan ke rute yang dituju
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token tidak valid' });
  }
};