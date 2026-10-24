import { useMemo } from 'react';
import { generateCrestSvg } from '../../lib/crestSeed';

interface CrestBadgeProps {
  seed: string;
  size?: number;
  className?: string;
}

export function CrestBadge({ seed, size = 64, className = '' }: CrestBadgeProps) {
  const svgString = useMemo(() => generateCrestSvg(seed, size), [seed, size]);
  const dataUri = useMemo(() => {
    const encoded = btoa(unescape(encodeURIComponent(svgString)));
    return `data:image/svg+xml;base64,${encoded}`;
  }, [svgString]);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Amber glow halo */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(212, 160, 23, 0.3), 0 0 40px rgba(212, 160, 23, 0.1)',
        }}
      />
      <img
        src={dataUri}
        alt="نشان خانوادگی"
        width={size}
        height={size}
        className="relative z-10"
      />
    </div>
  );
}
