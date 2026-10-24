import { formatPersianNumber } from '../../lib/format';

interface HeatmapDayProps {
  data: number[];
}

const DAY_NAMES = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export function HeatmapDay({ data }: HeatmapDayProps) {
  const max = Math.max(...data, 1);

  return (
    <div>
      <h3 className="text-sm font-bold text-command-text mb-2">الگوی روز هفته</h3>
      <div className="grid grid-cols-7 gap-1">
        {data.map((count, dayIndex) => {
          const intensity = count / max;
          const bgColor = intensity === 0 
            ? 'bg-command-panel' 
            : intensity > 0.75 
            ? 'bg-command-crimson' 
            : `rgba(139, 26, 26, ${intensity})`;

          return (
            <div key={dayIndex} className="text-center">
              <div
                className="aspect-square rounded flex items-center justify-center text-xs mb-1"
                style={{ backgroundColor: bgColor }}
                title={`${DAY_NAMES[dayIndex]} — ${formatPersianNumber(count)} حمله`}
              >
                {count > 0 && <span className="text-white text-[10px]">{count}</span>}
              </div>
              <p className="text-[10px] text-command-muted">{DAY_NAMES[dayIndex]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
