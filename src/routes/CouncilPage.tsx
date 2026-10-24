import { useState } from 'react';
import { AdvisorCard } from '../components/council/AdvisorCard';
import { CouncilChat } from '../components/council/CouncilChat';
import type { Advisor } from '../types/council';

export default function CouncilPage() {
  const [activeAdvisor, setActiveAdvisor] = useState<Advisor>('patience');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-2">
          شورای مشاوران
        </h1>
        <p className="text-command-muted">
          چهار مشاور، چهار زاویه. هرکدام را که می‌خواهی صدا کن.
        </p>
      </div>

      {/* Advisor Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['patience', 'war', 'mirror', 'sage'] as Advisor[]).map((advisor) => (
          <AdvisorCard
            key={advisor}
            advisor={advisor}
            active={activeAdvisor === advisor}
            onClick={() => setActiveAdvisor(advisor)}
          />
        ))}
      </div>

      {/* Chat */}
      <CouncilChat advisor={activeAdvisor} />
    </div>
  );
}
