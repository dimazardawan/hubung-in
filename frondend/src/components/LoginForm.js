'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './LoginForm.module.css'; // Impor style baru

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.msg || 'Terjadi kesalahan');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p style={{ color: 'red', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}
      
      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>
          Alamat Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <button
        type="submit"
        className={styles.submitButton}
      >
        Login
      </button>
    </form>
  );
}