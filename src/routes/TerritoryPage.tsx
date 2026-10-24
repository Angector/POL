import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTerritory } from '../hooks/useTerritory';
import { useStreak } from '../hooks/useStreak';
import { useUrges } from '../hooks/useUrges';
import { useCinematic } from '../components/battle/CinematicToast';
import { TerritoryMap3D } from '../components/map3d/TerritoryMap3D';
import { CityPanel } from '../components/map3d/CityPanel';
import { CityFreeSequence } from '../components/battle/CityFreeSequence';
import { DefeatSequence } from '../components/battle/DefeatSequence';
import { RiseLetter } from '../components/battle/RiseLetter';
import { UrgeModal } from '../components/battle/UrgeModal';
import { UrgeFloatingButton } from '../components/battle/UrgeFloatingButton';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import type { TileWithPosition } from '../types/tile';
import type { UrgeTrigger } from '../types/urge';

export default function TerritoryPage() {
  const { profile } = useAuth();
  const { territory, tiles, loading, error, refresh } = useTerritory();
  const { elapsedMs, isReady, hoursRemaining, liberate } = useStreak();
  const { submitResisted, submitDefeat, loading: urgesLoading } = useUrges();
  const cinematic = useCinematic();

  const [selectedTile, setSelectedTile] = useState<TileWithPosition | null>(null);
  const [urgeModalOpen, setUrgeModalOpen] = useState(false);
  const [cityFreeCity, setCityFreeCity] = useState<TileWithPosition | null>(null);
  const [defeatOpen, setDefeatOpen] = useState(false);
  const [riseLetterOpen, setRiseLetterOpen] = useState(false);
  const [liberateLoading, setLiberateLoading] = useState(false);

  const handleLiberate = async () => {
    if (!isReady) return;

    // Find next locked tile
    const nextTile = tiles.find(t => t.status === 'locked');
    if (!nextTile) return;

    setLiberateLoading(true);

    // Call RPC first
    const result = await liberate();

    if (result.success) {
      // Show cinematic animation
      setCityFreeCity(nextTile);
    } else {
      cinematic.show({
        title: 'خطا',
        subtitle: result.error || 'خطا در فتح شهر',
        icon: '❌',
      });
    }

    setLiberateLoading(false);
  };

  const handleCityFreeComplete = () => {
    setCityFreeCity(null);
    cinematic.show({
      title: 'شهر آزاد شد',
      subtitle: cityFreeCity?.name || '',
      icon: 'crest',
    });
  };

  const handleUrgeResist = async (data: { intensity: number; trigger: UrgeTrigger; privateNote?: string }) => {
    const result = await submitResisted(data);
    if (result.success) {
      setUrgeModalOpen(false);
      cinematic.show({
        title: 'حمله دفع شد',
        subtitle: '+۱۰ اراده',
        icon: '🛡️',
      });
    }
  };

  const handleUrgeDefeat = async (data: { intensity: number; trigger: UrgeTrigger; privateNote?: string }) => {
    const result = await submitDefeat(data);
    if (result.success) {
      setUrgeModalOpen(false);
      setDefeatOpen(true);
    }
  };

  const handleDefeatComplete = () => {
    setDefeatOpen(false);
    setRiseLetterOpen(true);
  };

  const handleRiseAccept = () => {
    setRiseLetterOpen(false);
    cinematic.show({
      title: 'برخاستی',
      subtitle: 'روحیه‌ی برخاسته فعال شد',
      icon: '🔥',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <p className="text-command-amber font-[family-name:var(--font-mono-hud)]">
          در حال بارگذاری سرزمین...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorBanner message={error} onRetry={refresh} />
      </div>
    );
  }

  if (tiles.length === 0) {
    return (
      <div className="p-4">
        <ErrorBanner message="سرزمینی یافت نشد. لطفاً دوباره وارد شوید." onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className="relative">
      <TerritoryMap3D
        tiles={tiles}
        territory={territory}
        territoryName={profile?.territory_name || null}
        onTileClick={setSelectedTile}
        elapsedMs={elapsedMs}
        isReady={isReady}
        hoursRemaining={hoursRemaining}
        onLiberate={handleLiberate}
        liberateLoading={liberateLoading}
        riseBuffUntil={profile?.rise_buff_until || null}
      />
      
      <CityPanel tile={selectedTile} onClose={() => setSelectedTile(null)} />
      
      <CityFreeSequence
        isOpen={!!cityFreeCity}
        cityName={cityFreeCity?.name || ''}
        cityMeaning={cityFreeCity?.name_meaning || null}
        onComplete={handleCityFreeComplete}
      />
      
      <DefeatSequence
        isOpen={defeatOpen}
        onComplete={handleDefeatComplete}
      />
      
      <RiseLetter
        isOpen={riseLetterOpen}
        onAccept={handleRiseAccept}
      />
      
      <UrgeModal
        isOpen={urgeModalOpen}
        onClose={() => setUrgeModalOpen(false)}
        onResist={handleUrgeResist}
        onDefeat={handleUrgeDefeat}
        loading={urgesLoading}
      />
      
      <UrgeFloatingButton onClick={() => setUrgeModalOpen(true)} />
    </div>
  );
}
