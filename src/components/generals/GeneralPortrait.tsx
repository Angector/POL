import { useMemo } from 'react';
import { generateCrestSvg } from '../../lib/crestSeed';

interface GeneralPortraitProps {
  seed: string;
  size?: number;
  className?: string;
}

export function GeneralPortrait({ seed, size = 80, className = '' }: GeneralPortraitProps) {
  const svgString = useMemo(() => generateCrestSvg(seed, size), [seed, size]);
  const dataUri = useMemo(() => {
    const encoded = btoa(unescape(encodeURIComponent(svgString)));
    return `image/svg+xml;base64,${encoded}`;
  }, [svgString]);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        boxShadow: '0 0 20px rgba(212, 160, 23, 0.3)',
      }}
    >
      <img
        src={dataUri}
        alt="پرتره ژنرال"
        width={size}
        height={size}
        className="object-cover"
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '3px solid #d4a017',
        }}
      />
    </div>
  );
}
