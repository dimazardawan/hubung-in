'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ProposalForm({ projectId }) {
  const [proposal_text, setProposalText] = useState('');
  const [bid_amount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`http://localhost:5001/api/proposals/${projectId}`, {
        proposal_text,
        bid_amount,
      });
      alert('Proposal berhasil dikirim!');
      router.push('/projects'); // Kembali ke halaman job board
    } catch (err) {
      setError(err.response?.data?.msg || 'Gagal mengirim proposal.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="proposal_text" className="block text-sm font-medium text-gray-700">
          Pesan Proposal / Surat Pengantar
        </label>
        <textarea
          id="proposal_text"
          rows="6"
          value={proposal_text}
          onChange={(e) => setProposalText(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Jelaskan mengapa Anda adalah kandidat terbaik untuk proyek ini..."
        ></textarea>
      </div>
      <div>
        <label htmlFor="bid_amount" className="block text-sm font-medium text-gray-700">
          Penawaran Harga Anda (Rp)
        </label>
        <input
          type="number"
          id="bid_amount"
          value={bid_amount}
          onChange={(e) => setBidAmount(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Contoh: 2800000"
        />
      </div>
      <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
        Kirim Proposal
      </button>
    </form>
  );
}