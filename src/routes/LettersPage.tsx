import { useState } from 'react';
import { useLetters } from '../hooks/useLetters';
import { usePublicProfiles } from '../hooks/usePublicProfiles';
import { Card } from '../components/ui/Card';
import { LETTER_TYPE_INFO } from '../lib/socialConstants';
import { formatRelativeTime } from '../lib/format';
import type { LetterType } from '../types/social';

export default function LettersPage() {
  const { inbox, sent, loading, send, markRead } = useLetters();
  const { profiles } = usePublicProfiles();
  const [tab, setTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');

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
          نامه‌ها
        </h1>
        <p className="text-command-muted">ارتباط با سایر فرماندهان</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('inbox')}
          className={`px-4 py-2 rounded ${
            tab === 'inbox'
              ? 'bg-command-amber text-command-bg'
              : 'bg-command-bg text-command-muted'
          }`}
        >
          صندوق ورودی ({inbox.length})
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`px-4 py-2 rounded ${
            tab === 'sent'
              ? 'bg-command-amber text-command-bg'
              : 'bg-command-bg text-command-muted'
          }`}
        >
          ارسال‌شده ({sent.length})
        </button>
        <button
          onClick={() => setTab('compose')}
          className={`px-4 py-2 rounded ${
            tab === 'compose'
              ? 'bg-command-amber text-command-bg'
              : 'bg-command-bg text-command-muted'
          }`}
        >
          نوشتن نامه
        </button>
      </div>

      {tab === 'inbox' && (
        <div className="space-y-3">
          {inbox.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-command-muted">صندوق ورودی خالی است</p>
            </Card>
          ) : (
            inbox.map((letter) => (
              <div
                key={letter.id}
                onClick={() => {
                  if (!letter.read_at) markRead(letter.id);
                }}
              >
                <Card className="cursor-pointer hover:border-command-amber transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {LETTER_TYPE_INFO[letter.type].icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-command-text">
                        {LETTER_TYPE_INFO[letter.type].label}
                      </span>
                      {!letter.read_at && (
                        <span className="w-2 h-2 bg-command-amber rounded-full" />
                      )}
                    </div>
                    {letter.subject && (
                      <p className="text-sm text-command-text mb-1">
                        {letter.subject}
                      </p>
                    )}
                    <p className="text-sm text-command-muted line-clamp-2">
                      {letter.body}
                    </p>
                    <p className="text-xs text-command-muted mt-2">
                      {formatRelativeTime(letter.created_at)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            ))
          )}
        </div>
      )}

      {tab === 'sent' && (
        <div className="space-y-3">
          {sent.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-command-muted">هنوز نامه‌ای ارسال نکرده‌اید</p>
            </Card>
          ) : (
            sent.map((letter) => (
              <Card key={letter.id}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {LETTER_TYPE_INFO[letter.type].icon}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-command-text mb-1">
                      {LETTER_TYPE_INFO[letter.type].label}
                    </p>
                    {letter.subject && (
                      <p className="text-sm text-command-text mb-1">
                        {letter.subject}
                      </p>
                    )}
                    <p className="text-sm text-command-muted line-clamp-2">
                      {letter.body}
                    </p>
                    <p className="text-xs text-command-muted mt-2">
                      {formatRelativeTime(letter.created_at)}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === 'compose' && <ComposeForm profiles={profiles} onSend={send} />}
    </div>
  );
}

function ComposeForm({
  profiles,
  onSend,
}: {
  profiles: any[];
  onSend: (params: { to: string; type: LetterType; subject?: string; body: string }) => Promise<any>;
}) {
  const [to, setTo] = useState('');
  const [type, setType] = useState<LetterType>('general');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!to || !body || body.length < 10) return;

    setLoading(true);
    try {
      await onSend({ to, type, subject: subject || undefined, body });
      setTo('');
      setSubject('');
      setBody('');
      alert('نامه ارسال شد');
    } catch (err) {
      alert('خطا در ارسال نامه');
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
            value={to}
            onChange={(e) => setTo(e.target.value)}
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
          <label className="block text-sm text-command-text mb-2">نوع نامه</label>
          <div className="grid grid-cols-5 gap-2">
            {(Object.keys(LETTER_TYPE_INFO) as LetterType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-2 rounded text-sm ${
                  type === t
                    ? 'bg-command-amber text-command-bg'
                    : 'bg-command-bg text-command-muted'
                }`}
              >
                {LETTER_TYPE_INFO[t].icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-command-text mb-2">موضوع (اختیاری)</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-command-bg border border-command-border rounded px-4 py-2 text-command-text"
          />
        </div>

        <div>
          <label className="block text-sm text-command-text mb-2">متن نامه</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="w-full bg-command-bg border border-command-border rounded px-4 py-2 text-command-text"
            placeholder="حداقل ۱۰ کاراکتر..."
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !to || body.length < 10}
          className="w-full py-3 bg-command-amber text-command-bg font-bold rounded hover:brightness-110 disabled:opacity-50"
        >
          {loading ? 'در حال ارسال...' : 'ارسال نامه'}
        </button>
      </div>
    </Card>
  );
}
