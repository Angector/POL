import { motion } from 'motion/react';
import { formatPersianNumber } from '../../lib/format';

interface SuccessGaugeProps {
  value: number;
  size?: number;
  color?: string;
  label?: string;
}

export function SuccessGauge({ 
  value, 
  size = 80, 
  color = '#d4a017',
  label = 'درصد موفقیت'
}: SuccessGaugeProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#2a3520"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-command-text font-[family-name:var(--font-mono-hud)]">
            {formatPersianNumber(value)}٪
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs text-command-muted">{label}</span>
      )}
    </div>
  );
}
