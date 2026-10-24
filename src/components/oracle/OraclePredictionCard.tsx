import { motion } from 'motion/react';
import type { OraclePrediction } from '../../types/oracle';
import { RISK_INFO } from '../../lib/advisorConstants';
import { formatDate } from '../../lib/format';

interface OraclePredictionCardProps {
  prediction: OraclePrediction | null;
  generating: boolean;
  onGenerate: () => void;
}

export function OraclePredictionCard({ prediction, generating, onGenerate }: OraclePredictionCardProps) {
  if (generating) {
    return (
      <div className="bg-command-panel border border-command-border rounded-lg p-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-4xl mb-4 inline-block"
        >
          🔮
        </motion.div>
        <p className="text-command-amber">اوراکل در حال دیدن آینده است...</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="bg-command-panel border border-command-border rounded-lg p-6 text-center">
        <p className="text-4xl mb-4">🔮</p>
        <p className="text-command-muted mb-4">هنوز پیش‌بینی برای امروز دریافت نکرده‌اید.</p>
        <button
          onClick={onGenerate}
          className="px-6 py-3 bg-command-amber text-command-bg font-bold rounded-lg hover:brightness-110 transition-all"
        >
          دریافت پیش‌بینی امروز
        </button>
      </div>
    );
  }

  const riskInfo = RISK_INFO[prediction.risk_level];

  return (
    <div className={`border-2 rounded-lg p-6 ${riskInfo.bgClass}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)]">
          پیش‌بینی امروز
        </h3>
        <span
          className="px-3 py-1 rounded-full text-sm font-bold"
          style={{ backgroundColor: riskInfo.color, color: '#fff' }}
        >
          سطح خطر: {riskInfo.label}
        </span>
      </div>

      {prediction.risk_window && (
        <div className="mb-4">
          <p className="text-sm text-command-muted mb-1">بازه‌ی پرخطر:</p>
          <p className="text-lg text-command-text font-bold">{prediction.risk_window}</p>
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm text-command-muted mb-1">تحلیل:</p>
        <p className="text-command-text italic">{prediction.reason}</p>
      </div>

      <div className="bg-command-amber/10 border border-command-amber rounded-lg p-4 mb-4">
        <p className="text-sm text-command-amber mb-1">پیشنهاد:</p>
        <p className="text-command-text">{prediction.suggestion}</p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-command-muted">
          تولید شده: {formatDate(prediction.generated_at)}
        </p>
        <button
          onClick={onGenerate}
          className="text-xs text-command-muted hover:text-command-amber transition-colors"
        >
          بازتولید
        </button>
      </div>
    </div>
  );
}
