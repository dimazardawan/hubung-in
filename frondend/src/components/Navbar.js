'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContent}`}>
        <Link href="/" className={styles.logo}>
          HUBUNG.IN
        </Link>

        <input type="search" placeholder="Search" className={styles.searchBar} />

        <div className={styles.navLinks}>
          <Link href="/">Beranda</Link>
          <Link href="/projects">Jobboard</Link>
          
          {isAuthenticated && user ? (
            <>
              <div className={styles.userInfo}>
                <span className={styles.userName}>Halo, {user.name}</span>
                <span className={styles.userRole}>({user.role})</span>
              </div>
              <Link href="/dashboard">Dashboard</Link>
              <button onClick={logout} className={styles.logoutButton}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.loginLink}>
                Login
              </Link>
              <Link href="/register" className={styles.registerButton}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}