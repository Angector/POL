function Health() {
  return (
    <div className="min-h-screen bg-command-bg flex flex-col items-center justify-center">
      <div className="text-center">
        <p className="font-[family-name:var(--font-mono-hud)] text-command-amber text-lg">
          سیستم سالم است ✓
        </p>
        <p className="mt-4 text-command-muted text-sm">
          مسیر /health به درستی کار می‌کند
        </p>
      </div>
    </div>
  );
}

export default Health;
