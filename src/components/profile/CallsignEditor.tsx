import { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { useToast } from '../layout/ToastHost';

interface CallsignEditorProps {
  initialCallsign: string;
}

export function CallsignEditor({ initialCallsign }: CallsignEditorProps) {
  const [callsign, setCallsign] = useState(initialCallsign);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateCallsign } = useProfile();
  const toast = useToast();

  const handleSave = async () => {
    if (!callsign.trim()) {
      setError('نام نمی‌تواند خالی باشد');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: updateError } = await updateCallsign(callsign);

    setLoading(false);

    if (updateError) {
      setError(updateError);
    } else {
      toast.show({ message: 'نام با موفقیت بروزرسانی شد', type: 'success' });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex gap-3">
        <input
          type="text"
          value={callsign}
          onChange={(e) => setCallsign(e.target.value)}
          disabled={loading}
          placeholder="نام فرمانده"
          className="flex-1 bg-command-bg border border-command-border rounded px-4 py-2 text-command-text focus:outline-none focus:border-command-amber disabled:opacity-50 transition-colors"
        />
        <button
          onClick={handleSave}
          disabled={loading || callsign === initialCallsign}
          className="px-6 py-2 bg-command-amber text-command-bg font-bold rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? '...' : 'ذخیره'}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
}
