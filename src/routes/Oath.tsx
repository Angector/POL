import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { OathScroll } from '../components/auth/OathScroll';

export default function Oath() {
  const navigate = useNavigate();
  const { session, profile, loading } = useAuth();
  const { signOath } = useProfile();

  const [accepted, setAccepted] = useState(false);
  const [signature, setSignature] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If user already signed oath, redirect to dashboard
  if (!loading && profile?.oath_signed_at) {
    navigate('/dashboard', { replace: true });
  }

  // If not logged in, redirect to login
  if (!loading && !session) {
    navigate('/login', { replace: true });
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-command-bg flex items-center justify-center">
        <div className="text-command-amber text-lg font-[family-name:var(--font-mono-hud)]">
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!accepted) {
      setError('لطفاً سوگند را بپذیرید');
      return;
    }

    if (!signature.trim()) {
      setError('لطفاً نام خود را تایپ کنید');
      return;
    }

    setSubmitting(true);

    const { error: oathError } = await signOath(signature.trim());

    setSubmitting(false);

    if (oathError) {
      setError(oathError);
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-command-bg py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Oath Scroll */}
        <OathScroll
          callsign={profile.callsign}
          territoryName={profile.territory_name}
        />

        {/* Acceptance Form */}
        <form onSubmit={handleSubmit} className="mt-12 max-w-md mx-auto space-y-6">
          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              disabled={submitting}
              className="mt-1 w-5 h-5 accent-command-amber cursor-pointer"
            />
            <span className="text-command-text">
              این سوگند را می‌پذیرم و متعهد می‌شوم که در نبرد با عادت‌های تاریک خویش، استوار بمانم.
            </span>
          </label>

          {/* Signature input */}
          <div>
            <label htmlFor="signature" className="block text-sm text-command-muted mb-2">
              نام خود را برای امضا تایپ کنید
            </label>
            <input
              id="signature"
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              disabled={submitting}
              placeholder={profile.callsign}
              className="w-full bg-command-panel border border-command-border rounded px-4 py-3 text-command-text focus:outline-none focus:border-command-amber disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            disabled={submitting || !accepted || !signature.trim()}
            className="w-full bg-command-amber text-command-bg font-bold py-3 rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? 'در حال امضا...' : 'امضای سوگند'}
          </button>
        </form>
      </div>
    </div>
  );
}
