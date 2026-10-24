import { useState } from 'react';
import { useTruce } from '../../hooks/useTruce';
import { Card } from '../ui/Card';
import { TRUCE_REASONS } from '../../lib/truceConstants';
import { formatPersianNumber } from '../../lib/format';
import { TruceComposer } from './TruceComposer';

export function TruceCard() {
  const { activeTruce, cancel } = useTruce();
  const [composerOpen, setComposerOpen] = useState(false);

  const handleCancel = async () => {
    if (confirm('آیا از لغو آتش‌بس مطمئن هستید؟')) {
      await cancel();
    }
  };

  if (activeTruce) {
    const reasonInfo = TRUCE_REASONS[activeTruce.reason as keyof typeof TRUCE_REASONS];
    
    return (
      <Card className="bg-command-olive/20 border-command-olive">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-command-olive mb-1">
              🕊 آتش‌بس فعال — {formatPersianNumber(activeTruce.days_remaining || 0)} روز باقی‌مانده
            </p>
            <p className="text-sm text-command-muted">
              دلیل: {reasonInfo?.icon} {reasonInfo?.label}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-command-crimson text-white rounded hover:brightness-110 transition-all"
          >
            لغو آتش‌بس
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="opacity-70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-command-muted mb-1">نیاز به استراحت داری؟</p>
          <p className="text-xs text-command-muted">
            🛡 جنگ داخلی آتش‌بس ندارد. این آتش‌بس فقط برای جنگ خارجی است.
          </p>
        </div>
        <button
          onClick={() => setComposerOpen(true)}
          className="px-4 py-2 bg-command-olive text-white rounded hover:brightness-110 transition-all"
        >
          آتش‌بس بگیر
        </button>
      </div>

      <TruceComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
      />
    </Card>
  );
}
