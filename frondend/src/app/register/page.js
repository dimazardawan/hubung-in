import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1.5rem' }}>
        Buat Akun Baru
      </h1>
      <RegisterForm />
    </div>
  );
}