import { useState } from 'react';
import { useAlliances } from '../hooks/useAlliances';
import { usePublicProfiles } from '../hooks/usePublicProfiles';
import { Card } from '../components/ui/Card';
import { CrestBadge } from '../components/profile/CrestBadge';
import { ALLIANCE_TYPE_INFO } from '../lib/socialConstants';
import { formatRelativeTime } from '../lib/format';
import type { AllianceType } from '../types/social';

export default function AlliancesPage() {
  const { accepted, incoming, loading, request, respond } = useAlliances();
  const { profiles } = usePublicProfiles();
  const [tab, setTab] = useState<'allies' | 'incoming' | 'request'>('allies');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-command-amber">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
          اتحاد و پیمان
        </h1>
        <p className="text-command-muted">با سایر فرماندهان پیمان ببند</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('allies')}
          className={`px-4 py-2 rounded ${
            tab === 'allies'
              ? 'bg-command-amber text-command-bg'
              : 'bg-command-bg text-command-muted'
          }`}
        >
          هم‌پیمان‌ها ({accepted.length})
        </button>
        <button
          onClick={() => setTab('incoming')}
          className={`px-4 py-2 rounded ${
            tab === 'incoming'
              ? 'bg-command-amber text-command-bg'
              : 'bg-command-bg text-command-muted'
          }`}
        >
          درخواست‌ها ({incoming.length})
        </button>
        <button
          onClick={() => setTab('request')}
          className={`px-4 py-2 rounded ${
            tab === 'request'
              ? 'bg-command-amber text-command-bg'
              : 'bg-command-bg text-command-muted'
          }`}
        >
          ارسال درخواست
        </button>
      </div>

      {tab === 'allies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accepted.length === 0 ? (
            <Card className="col-span-2 text-center py-12">
              <p className="text-command-muted">هنوز پیمانی نبسته‌اید</p>
            </Card>
          ) : (
            accepted.map((alliance) => (
              <Card key={alliance.id}>
                <div className="flex items-center gap-3">
                  <CrestBadge seed="default" size={48} />
                  <div className="flex-1">
                    <p className="font-bold text-command-text">
                      {ALLIANCE_TYPE_INFO[alliance.type].icon}{' '}
                      {ALLIANCE_TYPE_INFO[alliance.type].label}
                    </p>
                    <p className="text-xs text-command-muted">
                      {formatRelativeTime(alliance.responded_at || alliance.created_at)}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === 'incoming' && (
        <div className="space-y-3">
          {incoming.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-command-muted">درخواستی دریافت نکرده‌اید</p>
            </Card>
          ) : (
            incoming.map((alliance) => (
              <Card key={alliance.id}>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-bold text-command-text">
                      {ALLIANCE_TYPE_INFO[alliance.type].icon}{' '}
                      {ALLIANCE_TYPE_INFO[alliance.type].label}
                    </p>
                    {alliance.message && (
                      <p className="text-sm text-command-muted mt-1">
                        {alliance.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => respond(alliance.id, true)}
                      className="px-4 py-2 bg-command-olive text-white rounded hover:brightness-110"
                    >
                      پذیرش
                    </button>
                    <button
                      onClick={() => respond(alliance.id, false)}
                      className="px-4 py-2 bg-command-crimson text-white rounded hover:brightness-110"
                    >
                      رد
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === 'request' && (
        <RequestForm profiles={profiles} onRequest={request} />
      )}
    </div>
  );
}

function RequestForm({
  profiles,
  onRequest,
}: {
  profiles: any[];
  onRequest: (params: { recipient: string; type: AllianceType; message?: string }) => Promise<any>;
}) {
  const [recipient, setRecipient] = useState('');
  const [type, setType] = useState<AllianceType>('truce');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!recipient) return;

    setLoading(true);
    try {
      await onRequest({ recipient, type, message: message || undefined });
      setRecipient('');
      setMessage('');
      alert('درخواست ارسال شد');
    } catch (err) {
      alert('خطا در ارسال درخواست');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-command-text mb-2">گیرنده</label>
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full bg-command-bg border border-command-border rounded px-4 py-2 text-command-text"
          >
            <option value="">انتخاب کنید...</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.callsign}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-command-text mb-2">نوع پیمان</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ALLIANCE_TYPE_INFO) as AllianceType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-3 rounded ${
                  type === t
                    ? 'bg-command-amber text-command-bg'
                    : 'bg-command-bg text-command-muted'
                }`}
              >
                <div className="text-2xl mb-1">{ALLIANCE_TYPE_INFO[t].icon}</div>
                <div className="text-sm font-bold">{ALLIANCE_TYPE_INFO[t].label}</div>
                <div className="text-xs mt-1 opacity-70">
                  {ALLIANCE_TYPE_INFO[t].description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-command-text mb-2">پیام (اختیاری)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full bg-command-bg border border-command-border rounded px-4 py-2 text-command-text"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !recipient}
          className="w-full py-3 bg-command-amber text-command-bg font-bold rounded hover:brightness-110 disabled:opacity-50"
        >
          {loading ? 'در حال ارسال...' : 'ارسال درخواست'}
        </button>
      </div>
    </Card>
  );
}
