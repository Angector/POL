import { GeneralCard } from './GeneralCard';
import type { General } from '../../types/general';

interface GeneralsGalleryProps {
  generals: General[];
  onSelect: (general: General) => void;
  onDispatch?: (general: General) => void;
  isReceivedTab?: boolean;
}

export function GeneralsGallery({ generals, onSelect, onDispatch, isReceivedTab }: GeneralsGalleryProps) {
  if (generals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-command-muted mb-4">
          {isReceivedTab
            ? 'هنوز ژنرالی دریافت نکرده‌اید.'
            : 'با رسیدن به رتبه‌ی گروهبان (۵۰۰ امتیاز)، اولین ژنرال تو متولد می‌شود.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {generals.map((general) => (
        <GeneralCard
          key={general.id}
          general={general}
          onClick={() => onSelect(general)}
          onDispatch={!isReceivedTab && onDispatch ? () => onDispatch(general) : undefined}
        />
      ))}
    </div>
  );
}
