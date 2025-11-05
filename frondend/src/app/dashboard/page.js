'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './Dashboard.module.css'; // Impor style baru

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    if (user) {
      const fetchData = async () => {
        try {
          setDataLoading(true);
          const url = user.role === 'client' 
            ? 'http://localhost:5001/api/projects/my-projects' 
            : 'http://localhost:5001/api/proposals/my-proposals';
          const res = await axios.get(url);
          setData(res.data);
        } catch (error) {
          console.error('Gagal fetch data dashboard', error);
        } finally {
          setDataLoading(false);
        }
      };
      fetchData();
    }
  }, [user, loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  const ClientDashboard = () => (
    <div>
      <h2 className={styles.sectionTitle}>Proyek yang Anda Buat</h2>
      {data.length > 0 ? data.map(project => (
        <div key={project.project_id} className={styles.itemCard}>
          <h3 className={styles.itemTitle}>{project.title}</h3>
          <p>Status: <span className={`${styles.statusTag} ${styles[`status-${project.status}`]}`}>{project.status.replace('_', ' ')}</span></p>
        </div>
      )) : <p>Anda belum membuat proyek.</p>}
    </div>
  );

  const FreelancerDashboard = () => (
    <div>
      <h2 className={styles.sectionTitle}>Proposal yang Anda Kirim</h2>
      {data.length > 0 ? data.map(proposal => (
        <div key={proposal.proposal_id} className={styles.itemCard}>
          <h3 className={styles.itemTitle}>Proyek: {proposal.project_title}</h3>
          <p>Penawaran Anda: Rp {new Intl.NumberFormat('id-ID').format(proposal.bid_amount)}</p>
          <p>Status: <span className={`${styles.statusTag} ${styles[`status-${proposal.status}`]}`}>{proposal.status}</span></p>
        </div>
      )) : <p>Anda belum mengirim proposal apapun.</p>}
    </div>
  );

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.title}>Dashboard</h1>
        <p>Selamat datang kembali, {user?.name}!</p>
      </div>
      {dataLoading ? <p>Memuat data...</p> : (user.role === 'client' ? <ClientDashboard /> : <FreelancerDashboard />)}
    </div>
  );
}