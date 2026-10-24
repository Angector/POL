interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function ZoomControls({ onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
      <button
        onClick={onZoomIn}
        className="w-12 h-12 rounded-full bg-command-panel/80 border border-command-border text-command-text hover:border-command-amber hover:text-command-amber transition-colors flex items-center justify-center text-xl font-bold backdrop-blur-sm"
        aria-label="بزرگنمایی"
      >
        +
      </button>
      <button
        onClick={onZoomOut}
        className="w-12 h-12 rounded-full bg-command-panel/80 border border-command-border text-command-text hover:border-command-amber hover:text-command-amber transition-colors flex items-center justify-center text-xl font-bold backdrop-blur-sm"
        aria-label="کوچک‌نمایی"
      >
        −
      </button>
      <button
        onClick={onReset}
        className="w-12 h-12 rounded-full bg-command-panel/80 border border-command-border text-command-text hover:border-command-amber hover:text-command-amber transition-colors flex items-center justify-center text-sm backdrop-blur-sm"
        aria-label="بازنشانی دوربین"
      >
        ⟲
      </button>
    </div>
  );
}
