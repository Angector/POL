import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: 'amber' | 'olive' | 'crimson' | 'muted';
  size?: 'sm' | 'md';
}

const colorStyles = {
  amber: { border: '#d4a017', bg: 'rgba(212, 160, 23, 0.1)', text: '#d4a017' },
  olive: { border: '#4a5d23', bg: 'rgba(74, 93, 35, 0.1)', text: '#4a5d23' },
  crimson: { border: '#8b1a1a', bg: 'rgba(139, 26, 26, 0.1)', text: '#8b1a1a' },
  muted: { border: '#8a8578', bg: 'rgba(138, 133, 120, 0.1)', text: '#8a8578' },
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
};

export function Badge({ children, color = 'amber', size = 'md' }: BadgeProps) {
  const colors = colorStyles[color];

  return (
    <span
      className={`inline-flex items-center rounded border font-medium ${sizeStyles[size]}`}
      style={{
        borderColor: colors.border,
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {children}
    </span>
  );
}
