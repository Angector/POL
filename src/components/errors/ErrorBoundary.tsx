import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-command-bg flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-command-panel border border-command-crimson rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-command-crimson font-[family-name:var(--font-serif-epic)] mb-4">
              نبرد در این جبهه متوقف شد
            </h1>
            <p className="text-command-text mb-6">
              خطایی غیرمنتظره رخ داد. لطفاً دوباره تلاش کنید یا به داشبورد بازگردید.
            </p>
            {this.state.error && (
              <details className="text-left mb-6">
                <summary className="text-xs text-command-muted cursor-pointer mb-2">
                  جزئیات خطا
                </summary>
                <pre className="text-xs text-command-muted bg-command-bg p-3 rounded overflow-auto max-h-40">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-command-amber text-command-bg font-bold rounded hover:brightness-110 transition-all"
              >
                تلاش دوباره
              </button>
              <a
                href="/mind-citadel/dashboard"
                className="flex-1 px-4 py-2 bg-command-bg border border-command-border text-command-text rounded hover:border-command-amber transition-colors text-center"
              >
                بازگشت به داشبورد
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
