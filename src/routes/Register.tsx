import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SignupForm } from '../components/auth/SignupForm';

export default function Register() {
  const navigate = useNavigate();
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && session && profile) {
      if (profile.oath_signed_at) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/oath', { replace: true });
      }
    }
  }, [session, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-command-bg flex items-center justify-center">
        <div className="text-command-amber text-lg font-[family-name:var(--font-mono-hud)]">
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: 'radial-gradient(ellipse at center, #0f1a0f 0%, #0a0f0a 70%)',
      }}
    >
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] tracking-wider">
          قلعه‌ی ذهن
        </h1>
        <p className="mt-4 text-command-muted text-sm">
          دروازه‌ی ورود به سرزمین شما
        </p>
      </div>

      {/* Signup Form */}
      <SignupForm />
    </div>
  );
}
