interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="bg-command-crimson/20 border border-command-crimson rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-red-300 mb-1">خطا</h3>
          <p className="text-sm text-red-200">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 text-xs bg-command-crimson text-white rounded hover:brightness-110 transition-all whitespace-nowrap"
          >
            تلاش مجدد
          </button>
        )}
      </div>
    </div>
  );
}
