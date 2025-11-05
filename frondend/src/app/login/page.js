import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1.5rem' }}>
        Login ke Akun Anda
      </h1>
      <LoginForm />
    </div>
  );
}