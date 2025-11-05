import Link from 'next/link';

// Komponen ini menerima satu objek 'project' sebagai prop
export default function ProjectCard({ project }) {
  return (
    <div className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-xl font-bold text-indigo-600">{project.title}</h3>
      <p className="text-gray-500 mt-1">oleh {project.client_name}</p>
      <p className="mt-4 text-gray-700">
        {/* Memotong deskripsi agar tidak terlalu panjang */}
        {project.description.substring(0, 150)}...
      </p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-lg font-semibold text-green-600">
          Rp {new Intl.NumberFormat('id-ID').format(project.budget_amount)}
        </span>
        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {project.category}
        </span>
      </div>
      <Link href={`/projects/${project.project_id}`} className="mt-6 inline-block w-full text-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
          Lihat Detail
      </Link>
    </div>
  );
}