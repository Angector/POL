import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Map error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[calc(100vh-64px)] bg-command-bg flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-command-panel border border-command-border rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-xl font-bold text-command-amber font-[family-name:var(--font-serif-epic)] mb-4">
              مپ سه‌بعدی در دسترس نیست
            </h2>
            <p className="text-command-text mb-4">
              مپ سه‌بعدی روی این دستگاه لود نشد. ممکن است مرورگر شما از WebGL پشتیبانی نکند یا منابع کافی نداشته باشد.
            </p>
            <p className="text-sm text-command-muted mb-6">
              می‌توانید از نمای لیستی استفاده کنید یا مرورگر خود را بروزرسانی کنید.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-command-amber text-command-bg font-bold rounded hover:brightness-110 transition-all"
              >
                تلاش دوباره
              </button>
              <a
                href="#list-view"
                className="w-full px-4 py-2 bg-command-bg border border-command-border text-command-text rounded hover:border-command-amber transition-colors text-center"
              >
                نمایش لیست شهرها
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
