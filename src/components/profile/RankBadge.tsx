import { getRankByPoints, getNextRank } from '../../lib/constants';

interface RankBadgeProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RankBadge({ points, size = 'md' }: RankBadgeProps) {
  const rank = getRankByPoints(points);
  const nextRank = getNextRank(points);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2',
  };

  const iconSize = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const progressPercent = nextRank
    ? Math.min(
        100,
        ((points - rank.minPoints) / (nextRank.minPoints - rank.minPoints)) * 100
      )
    : 100;

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <div
        className={`inline-flex items-center rounded border font-[family-name:var(--font-sans-body)] ${sizeClasses[size]}`}
        style={{
          borderColor: rank.color,
          backgroundColor: `${rank.color}15`,
          color: rank.color,
        }}
      >
        <span className={iconSize[size]}>{rank.icon}</span>
        <span className="font-bold">{rank.title}</span>
      </div>

      {size === 'lg' && (
        <div className="w-full mt-1">
          <div className="flex items-center justify-between text-xs text-command-muted mb-1">
            <span>{rank.title}</span>
            {nextRank && <span>{nextRank.title}</span>}
          </div>
          <div className="w-full h-2 bg-command-bg rounded-full overflow-hidden border border-command-border">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: rank.color,
              }}
            />
          </div>
          {nextRank && (
            <p className="text-xs text-command-muted mt-1">
              {Math.ceil(nextRank.minPoints - points)} امتیاز تا رتبه‌ی بعدی
            </p>
          )}
        </div>
      )}
    </div>
  );
}
