'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './RegisterForm.module.css'; // Impor style baru

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // Default role
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:5001/api/auth/register', {
        name,
        email,
        password,
        role,
      });

      alert('Registrasi Berhasil! Silakan login.');
      router.push('/login');

    } catch (err) {
      if (err.response) {
        console.error('Error dari server:', err.response.data);
        setError(err.response.data.msg || 'Terjadi kesalahan.');
      } else {
        console.error('Error jaringan atau lainnya:', err.message);
        setError('Tidak dapat terhubung ke server.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p style={{ color: 'red', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}
      
      <div className={styles.inputGroup}>
        <label htmlFor="name" className={styles.label}>Nama Lengkap</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className={styles.input} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>Alamat Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="password" className={styles.label}>Password</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Daftar sebagai:</label>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input type="radio" value="client" checked={role === 'client'} onChange={(e) => setRole(e.target.value)} />
            <span>Klien (Pemberi Kerja)</span>
          </label>
          <label className={styles.radioLabel}>
            <input type="radio" value="freelancer" checked={role === 'freelancer'} onChange={(e) => setRole(e.target.value)} />
            <span>Freelancer</span>
          </label>
        </div>
      </div>

      <button type="submit" className={styles.submitButton}>
        Register
      </button>
    </form>
  );
}