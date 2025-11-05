'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// 1. Membuat Context
const AuthContext = createContext(null);

// 2. Membuat Provider Komponen
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fungsi untuk mengatur default header axios dengan token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  // Cek token di localStorage saat aplikasi pertama kali dimuat
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      setAuthToken(tokenFromStorage);
      loadUser(tokenFromStorage);
    } else {
      setLoading(false);
    }
  }, []);

  // Fungsi untuk memuat data user berdasarkan token
  const loadUser = async (token) => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/auth/me');
      setUser(res.data);
    } catch (error) {
      console.error('Gagal memuat user, token mungkin tidak valid');
      // Jika gagal, hapus token
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
        setLoading(false);
    }
  };

  // Fungsi untuk Login
  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      await loadUser(res.data.token);
      router.push('/'); // Redirect ke homepage setelah login
      return true; // Sukses
    } catch (err) {
        console.error(err.response.data.msg);
        throw err; // Lempar error agar komponen form bisa menangkapnya
    }
  };

  // Fungsi untuk Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthToken(null);
    router.push('/login'); // Arahkan ke halaman login setelah logout
  };

  // Nilai yang akan disediakan untuk semua komponen anak
  const value = {
    token,
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    // Kita akan tambahkan register nanti
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// 3. Membuat Custom Hook untuk menggunakan context dengan mudah
export const useAuth = () => useContext(AuthContext);