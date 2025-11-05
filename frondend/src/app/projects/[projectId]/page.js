'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Hook untuk mengambil parameter dari URL
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams(); // Mendapatkan { projectId: '...' } dari URL
  const { projectId } = params;
  const { user } = useAuth(); // Mendapatkan data user yang sedang login

  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`http://localhost:5001/api/projects/${projectId}`);
          setProject(res.data);
        } catch (err) {
          console.error(err);
          setError('Gagal memuat detail proyek.');
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [projectId]);

  if (loading) return <p className="text-center">Loading detail proyek...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!project) return <p>Proyek tidak ditemukan.</p>;

  // Fungsi untuk menampilkan tombol aksi berdasarkan peran user
  const renderActionButtons = () => {
    if (!user) return null;

    // Jika user adalah freelancer, tampilkan tombol Lamar
if (user.role === 'freelancer') {
  return (
    <Link href={`/projects/${project.project_id}/apply`} className="w-full inline-block text-center bg-green-500 text-white px-4 py-3 rounded-md hover:bg-green-600 font-bold">
      Lamar Proyek Ini
    </Link>
  );
}

    // Jika user adalah klien pemilik proyek, tampilkan tombol Lihat Proposal
    if (user.role === 'client' && user.user_id === project.client_id) {
      return <Link href={`/proposals/project/${project.project_id}`} className="w-full inline-block text-center bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 font-bold">Lihat Proposal yang Masuk</Link>;
    }

    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Kolom Kiri: Detail Utama */}
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-4xl font-bold">{project.title}</h1>
        <p className="text-lg text-gray-600">Diposting oleh: <span className="font-semibold">{project.client_name}</span></p>
        <div>
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Deskripsi Proyek</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
        </div>
      </div>
      {/* Kolom Kanan: Info & Aksi */}
      <div className="md:col-span-1 space-y-4">
        <div className="border rounded-lg p-4">
          <p className="text-xl font-bold text-green-600">Rp {new Intl.NumberFormat('id-ID').format(project.budget_amount)}</p>
          <p className="text-gray-500">{project.budget_type === 'fixed' ? 'Budget Tetap' : 'Per Jam'}</p>
          <hr className="my-4"/>
          <p><span className="font-semibold">Kategori:</span> {project.category}</p>
          <p><span className="font-semibold">Batas Waktu:</span> {new Date(project.deadline).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="mt-4">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
}