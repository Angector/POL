import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('لطفاً ایمیل خود را وارد کنید');
      return;
    }

    if (!password) {
      setError('لطفاً رمز عبور را وارد کنید');
      return;
    }

    setLoading(true);

    const { error: signInError } = await signIn(email.trim(), password);

    setLoading(false);

    if (signInError) {
      setError(signInError);
      return;
    }

    // Navigation is handled by the route component based on oath status
    // But we can provide a default redirect
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-command-panel border border-command-border rounded-lg p-8">
        <h2 className="text-2xl font-bold text-command-amber text-center mb-8 font-[family-name:var(--font-serif-epic)]">
          ورود به قلعه
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-command-muted mb-2">
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="commander@example.com"
              dir="ltr"
              className="w-full bg-command-bg border border-command-border rounded px-4 py-3 text-command-text text-left focus:outline-none focus:border-command-amber disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm text-command-muted mb-2">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="رمز عبور"
              dir="ltr"
              className="w-full bg-command-bg border border-command-border rounded px-4 py-3 text-command-text text-left focus:outline-none focus:border-command-amber disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="bg-command-crimson/20 border border-command-crimson rounded px-4 py-3 text-sm text-red-200"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-command-amber text-command-bg font-bold py-3 rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-command-muted mt-6">
          حساب نداری؟{' '}
          <Link to="/register" className="text-command-amber hover:underline">
            ثبت‌نام
          </Link>
        </p>
      </div>
    </div>
  );
}
