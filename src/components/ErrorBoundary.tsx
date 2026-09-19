import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Scan } from 'lucide-react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BioDex View caught error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-md mx-auto p-6 my-8 bg-white border border-rose-200 rounded-3xl shadow-sm text-center font-sans space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">View Temporarily Recovering</h3>
            <p className="text-xs text-slate-500 mt-1">
              An unexpected display issue occurred in this section. All your field survey records are safely preserved in memory.
            </p>
          </div>
          <div className="flex gap-2 justify-center pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry View</span>
            </button>
            <button
              type="button"
              onClick={() => {
                this.handleReset();
                window.location.hash = '';
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer"
            >
              <Scan className="w-3.5 h-3.5 text-emerald-600" />
              <span>Return to Scanner</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
