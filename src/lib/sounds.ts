// Sound system with MP3 fallback to Web Audio API oscillators

const BASE_PATH = import.meta.env.BASE_URL || '/';

interface SoundFile {
  name: string;
  path: string;
  audio: HTMLAudioElement | null;
  loaded: boolean;
}

// Map of all sound files
const soundFiles: Record<string, SoundFile> = {
  horn: { name: 'horn', path: `${BASE_PATH}sounds/horn.mp3`, audio: null, loaded: false },
  drum: { name: 'drum', path: `${BASE_PATH}sounds/drum.mp3`, audio: null, loaded: false },
  defeat: { name: 'defeat', path: `${BASE_PATH}sounds/defeat.mp3`, audio: null, loaded: false },
  'urge-hit': { name: 'urge-hit', path: `${BASE_PATH}sounds/urge-hit.mp3`, audio: null, loaded: false },
  resist: { name: 'resist', path: `${BASE_PATH}sounds/resist.mp3`, audio: null, loaded: false },
  'sos-alarm': { name: 'sos-alarm', path: `${BASE_PATH}sounds/sos-alarm.mp3`, audio: null, loaded: false },
  'breath-in': { name: 'breath-in', path: `${BASE_PATH}sounds/breath-in.mp3`, audio: null, loaded: false },
  'breath-out': { name: 'breath-out', path: `${BASE_PATH}sounds/breath-out.mp3`, audio: null, loaded: false },
  rise: { name: 'rise', path: `${BASE_PATH}sounds/rise.mp3`, audio: null, loaded: false },
  'ambient-loop': { name: 'ambient-loop', path: `${BASE_PATH}sounds/ambient-loop.mp3`, audio: null, loaded: false },
  'city-freed-fanfare': { name: 'city-freed-fanfare', path: `${BASE_PATH}sounds/city-freed-fanfare.mp3`, audio: null, loaded: false },
};

// Web Audio API context
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Try to load a sound file
 */
export function loadSound(name: string): HTMLAudioElement | null {
  const sound = soundFiles[name];
  if (!sound) return null;

  if (sound.audio && sound.loaded) {
    return sound.audio;
  }

  try {
    const audio = new Audio(sound.path);
    audio.preload = 'auto';
    
    audio.addEventListener('canplaythrough', () => {
      sound.loaded = true;
    }, { once: true });

    audio.addEventListener('error', () => {
      console.warn(`Failed to load sound: ${name}`);
      sound.loaded = false;
    });

    sound.audio = audio;
    return audio;
  } catch (error) {
    console.warn(`Error loading sound ${name}:`, error);
    return null;
  }
}

/**
 * Preload all sounds
 */
export function preloadAllSounds(): void {
  Object.keys(soundFiles).forEach(loadSound);
}

/**
 * Play a sound with volume control
 * Falls back to oscillator if MP3 not available
 */
export function playSound(name: string, volume: number = 0.7): void {
  const sound = soundFiles[name];
  
  // Try to play MP3 first
  if (sound?.audio && sound.loaded) {
    try {
      const audio = sound.audio.cloneNode() as HTMLAudioElement;
      audio.volume = volume;
      audio.play().catch(() => {
        // Fallback to oscillator if play fails
        playOscillator(name);
      });
      return;
    } catch (error) {
      console.warn(`Error playing sound ${name}, falling back to oscillator`);
    }
  }

  // Fallback to oscillator
  playOscillator(name);
}

/**
 * Play oscillator-based sound (fallback)
 */
function playOscillator(name: string): void {
  try {
    const ctx = getAudioContext();

    switch (name) {
      case 'horn':
      case 'city-freed-fanfare':
        playHornOsc(ctx);
        break;
      case 'drum':
      case 'defeat':
        playDrumOsc(ctx);
        break;
      case 'urge-hit':
        playUrgeHitOsc(ctx);
        break;
      case 'resist':
        playResistOsc(ctx);
        break;
      case 'sos-alarm':
        playSosAlarmOsc(ctx);
        break;
      case 'breath-in':
        playBreathInOsc(ctx);
        break;
      case 'breath-out':
        playBreathOutOsc(ctx);
        break;
      case 'rise':
        playRiseOsc(ctx);
        break;
      default:
        console.warn(`Unknown sound: ${name}`);
    }
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
}

// Oscillator implementations
function playHornOsc(ctx: AudioContext): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(440, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.8);
}

function playDrumOsc(ctx: AudioContext): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(80, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);

  gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.5);
}

function playUrgeHitOsc(ctx: AudioContext): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.15);
}

function playResistOsc(ctx: AudioContext): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(523, ctx.currentTime); // C5
  oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // E5

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.3);
}

function playSosAlarmOsc(ctx: AudioContext): void {
  for (let i = 0; i < 3; i++) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime + i * 0.2);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.15);

    oscillator.start(ctx.currentTime + i * 0.2);
    oscillator.stop(ctx.currentTime + i * 0.2 + 0.15);
  }
}

function playBreathInOsc(ctx: AudioContext): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(220, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 2);

  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 2);
}

function playBreathOutOsc(ctx: AudioContext): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(330, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 2);

  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 2);
}

function playRiseOsc(ctx: AudioContext): void {
  // Chord: C + E + G
  const notes = [261, 329, 392]; // C4, E4, G4
  
  notes.forEach((freq) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1);
  });
}

// Legacy exports for backward compatibility
export async function playHorn(): Promise<void> {
  playSound('horn');
}

export async function playDrum(): Promise<void> {
  playSound('drum');
}

export async function playDefeat(): Promise<void> {
  playSound('defeat');
}

export async function playBreathIn(): Promise<void> {
  playSound('breath-in');
}

export async function playBreathOut(): Promise<void> {
  playSound('breath-out');
}
