import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="error-container">
          <h2>A apărut o eroare!</h2>
          <p>Ne pare rău, ceva nu a funcționat corect.</p>
          <p>Detalii eroare: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reîncarcă pagina</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
