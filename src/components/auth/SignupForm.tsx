import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { InviteCodeForm } from './InviteCodeForm';

export function SignupForm() {
  const navigate = useNavigate();
  const { signUpWithInvite } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('لطفاً نام خود را وارد کنید');
      return;
    }

    if (!email.trim()) {
      setError('لطفاً ایمیل خود را وارد کنید');
      return;
    }

    if (password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    if (inviteCode.length !== 6) {
      setError('کد دعوت باید ۶ رقم باشد');
      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUpWithInvite({
      name: name.trim(),
      email: email.trim(),
      password,
      inviteCode,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError);
      return;
    }

    // Success – navigate to oath
    navigate('/oath');
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-command-panel border border-command-border rounded-lg p-8">
        <h2 className="text-2xl font-bold text-command-amber text-center mb-8 font-[family-name:var(--font-serif-epic)]">
          پیوستن به ارتش
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm text-command-muted mb-2">
              نام فرمانده
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder="نام شما در قلعه"
              className="w-full bg-command-bg border border-command-border rounded px-4 py-3 text-command-text focus:outline-none focus:border-command-amber disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
          </div>

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
              placeholder="حداقل ۶ کاراکتر"
              dir="ltr"
              className="w-full bg-command-bg border border-command-border rounded px-4 py-3 text-command-text text-left focus:outline-none focus:border-command-amber disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          {/* Invite Code */}
          <InviteCodeForm
            value={inviteCode}
            onChange={setInviteCode}
            disabled={loading}
          />

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
            {loading ? 'در حال پیوستن...' : 'ورود به قلعه'}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-command-muted mt-6">
          قبلاً عضو هستی؟{' '}
          <Link to="/login" className="text-command-amber hover:underline">
            ورود
          </Link>
        </p>
      </div>
    </div>
  );
}
