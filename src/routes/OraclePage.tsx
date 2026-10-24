import { useOracle } from '../hooks/useOracle';
import { useUrgeStats } from '../hooks/useUrgeStats';
import { OraclePredictionCard } from '../components/oracle/OraclePredictionCard';
import { OracleHistory } from '../components/oracle/OracleHistory';
import { PatternSummary } from '../components/patterns/PatternSummary';
import { Card } from '../components/ui/Card';
import { ErrorBanner } from '../components/ui/ErrorBanner';

export default function OraclePage() {
  const { todayPrediction, history, loading, generating, error, generate } = useOracle();
  const { stats } = useUrgeStats(30);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-command-amber font-[family-name:var(--font-mono-hud)]">
          در حال بارگذاری...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
          اوراکل
        </h1>
        <p className="text-command-muted">
          پیش‌بینی آینده بر اساس الگوهای گذشته
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      <OraclePredictionCard
        prediction={todayPrediction}
        generating={generating}
        onGenerate={generate}
      />

      {stats && (
        <Card>
          <PatternSummary stats={stats} />
        </Card>
      )}

      <OracleHistory predictions={history} />
    </div>
  );
}
