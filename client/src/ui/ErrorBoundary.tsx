import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="movie-card p-6 sm:p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-rose-500/20 rounded-full">
                <AlertTriangle className="w-12 h-12 text-rose-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Щось пішло не так
            </h1>
            <p className="text-slate-400 mb-6">
              Виникла несподівана помилка. Спробуйте оновити сторінку.
            </p>
            {this.state.error && (
              <details className="text-left mb-6">
                <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-400">
                  Технічні деталі
                </summary>
                <pre className="mt-2 text-xs text-rose-300 bg-slate-900/50 p-3 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl px-6 py-3 transition-all duration-300 transform hover:scale-105 glow-effect-pink"
            >
              Оновити сторінку
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
