import { useState } from 'react';
import { useGenerals } from '../hooks/useGenerals';
import { GeneralsGallery } from '../components/generals/GeneralsGallery';
import { GeneralDetailModal } from '../components/generals/GeneralDetailModal';
import { DispatchGeneralModal } from '../components/generals/DispatchGeneralModal';
import { formatPersianNumber } from '../lib/format';
import type { General } from '../types/general';

export default function GeneralsHall() {
  const { generals, loading, error, dispatch } = useGenerals();
  const [tab, setTab] = useState<'home' | 'received'>('home');
  const [selectedGeneral, setSelectedGeneral] = useState<General | null>(null);
  const [dispatchTarget, setDispatchTarget] = useState<General | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-command-amber font-[family-name:var(--font-mono-hud)]">
          در حال بارگذاری...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-command-crimson/20 border border-command-crimson rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  const homeGenerals = generals.filter((g) => g.status === 'home' || g.status === 'dispatched');
  const receivedGenerals = generals.filter((g) => g.status === 'received');

  const handleDispatch = async (recipientId: string, message?: string) => {
    if (!dispatchTarget) return;
    await dispatch(dispatchTarget.id, recipientId, message);
    setDispatchTarget(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
          تالار ژنرال‌ها
        </h1>
        <p className="text-command-muted">
          آرشیو تجربه‌ی شما در هر رتبه
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-command-panel border border-command-border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-command-amber font-[family-name:var(--font-mono-hud)]">
            {formatPersianNumber(homeGenerals.length)}
          </p>
          <p className="text-sm text-command-muted">ژنرال‌های شما</p>
        </div>
        <div className="bg-command-panel border border-command-border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-command-olive font-[family-name:var(--font-mono-hud)]">
            {formatPersianNumber(receivedGenerals.length)}
          </p>
          <p className="text-sm text-command-muted">ژنرال‌های دریافتی</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('home')}
          className={`px-4 py-2 rounded ${
            tab === 'home'
              ? 'bg-command-amber text-command-bg'
              : 'bg-command-bg text-command-muted'
          }`}
        >
          ژنرال‌های من
        </button>
        <button
          onClick={() => setTab('received')}
          className={`px-4 py-2 rounded ${
            tab === 'received'
              ? 'bg-command-amber text-command-bg'
              : 'bg-command-bg text-command-muted'
          }`}
        >
          دریافتی
        </button>
      </div>

      {tab === 'home' ? (
        <GeneralsGallery
          generals={homeGenerals}
          onSelect={setSelectedGeneral}
          onDispatch={setDispatchTarget}
        />
      ) : (
        <GeneralsGallery
          generals={receivedGenerals}
          onSelect={setSelectedGeneral}
          isReceivedTab
        />
      )}

      <GeneralDetailModal
        general={selectedGeneral}
        onClose={() => setSelectedGeneral(null)}
        onDispatch={selectedGeneral ? () => {
          setSelectedGeneral(null);
          setDispatchTarget(selectedGeneral);
        } : undefined}
      />

      <DispatchGeneralModal
        general={dispatchTarget}
        onClose={() => setDispatchTarget(null)}
        onDispatch={handleDispatch}
      />
    </div>
  );
}
