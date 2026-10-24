import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { playSound, preloadAllSounds } from '../lib/sounds';

interface SoundContextType {
  muted: boolean;
  volume: number;
  play: (name: string) => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

const MUTED_KEY = 'mind-citadel-muted';
const VOLUME_KEY = 'mind-citadel-volume';

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(() => {
    const saved = localStorage.getItem(MUTED_KEY);
    return saved === 'true';
  });

  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem(VOLUME_KEY);
    return saved ? parseFloat(saved) : 0.7;
  });

  // Preload sounds on mount
  useEffect(() => {
    preloadAllSounds();
  }, []);

  // Save muted state
  useEffect(() => {
    localStorage.setItem(MUTED_KEY, String(muted));
  }, [muted]);

  // Save volume state
  useEffect(() => {
    localStorage.setItem(VOLUME_KEY, String(volume));
  }, [volume]);

  const play = useCallback((name: string) => {
    if (muted) return;
    playSound(name, volume);
  }, [muted, volume]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  return (
    <SoundContext.Provider value={{ muted, volume, play, toggleMute, setVolume }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound(): SoundContextType {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
