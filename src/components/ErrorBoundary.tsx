import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center bg-red-50 border border-red-200 rounded-3xl m-4">
          <h2 className="text-xl font-bold text-red-700 mb-2">Terjadi Kesalahan</h2>
          <p className="text-red-600 mb-4">Maaf, terjadi kesalahan saat memuat komponen ini.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
