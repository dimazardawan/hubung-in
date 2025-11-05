'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import ProposalForm from '@/components/ProposalForm';

export default function ApplyPage() {
  const [project, setProject] = useState(null);
  const params = useParams();
  const { projectId } = params;

  useEffect(() => {
    if (projectId) {
      axios.get(`http://localhost:5001/api/projects/${projectId}`)
        .then(res => setProject(res.data))
        .catch(err => console.error(err));
    }
  }, [projectId]);

  return (
    <div className="flex flex-col items-center">
      {project ? (
        <>
          <h1 className="text-3xl font-bold mb-2">Ajukan Proposal untuk Proyek</h1>
          <p className="text-xl text-indigo-600 mb-8">{project.title}</p>
          <ProposalForm projectId={projectId} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}