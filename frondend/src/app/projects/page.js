'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from '@/components/ProjectCard'; // Impor komponen Card
import { useAuth } from '@/context/AuthContext'; // Untuk memastikan token terpasang

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Kita panggil ini agar useEffect tahu kapan harus re-fetch jika token berubah

  useEffect(() => {
    const fetchProjects = async () => {
      // Pastikan token sudah ada sebelum fetch. Axios sudah kita set
      // untuk otomatis menyertakan token di header dari AuthContext.
      if (token) {
        try {
          setLoading(true);
          const res = await axios.get('http://localhost:5001/api/projects');
          setProjects(res.data);
          setError(null);
        } catch (err) {
          console.error("Gagal mengambil data proyek:", err);
          setError("Gagal memuat data proyek. Coba lagi nanti.");
        } finally {
          setLoading(false);
        }
      } else {
        // Jika tidak ada token (misal: user belum login & AuthContext masih loading)
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]); // <-- useEffect akan berjalan saat komponen dimuat & saat token berubah

  if (loading) return <p className="text-center">Loading proyek...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Daftar Proyek Tersedia</h1>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.project_id} project={project} />
          ))}
        </div>
      ) : (
        <p>Saat ini tidak ada proyek yang tersedia.</p>
      )}
    </div>
  );
}