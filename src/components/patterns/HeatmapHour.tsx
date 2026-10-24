import { formatPersianNumber } from '../../lib/format';

interface HeatmapHourProps {
  data: number[];
}

export function HeatmapHour({ data }: HeatmapHourProps) {
  const max = Math.max(...data, 1);

  return (
    <div>
      <h3 className="text-sm font-bold text-command-text mb-2">الگوی ساعتی</h3>
      <div className="grid grid-cols-12 gap-1">
        {data.map((count, hour) => {
          const intensity = count / max;
          const bgColor = intensity === 0 
            ? 'bg-command-panel' 
            : intensity > 0.75 
            ? 'bg-command-crimson' 
            : `rgba(139, 26, 26, ${intensity})`;

          return (
            <div
              key={hour}
              className="aspect-square rounded flex items-center justify-center text-xs"
              style={{ backgroundColor: bgColor }}
              title={`ساعت ${formatPersianNumber(hour)} — ${formatPersianNumber(count)} حمله`}
            >
              {count > 0 && <span className="text-white text-[10px]">{count}</span>}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-command-muted mt-1">
        <span>۰</span>
        <span>۱۲</span>
        <span>۲۳</span>
      </div>
    </div>
  );
}
