import { Component, ReactNode } from "react";

import { DemoError } from "./demo-layout";

interface DemoErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

interface DemoErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class DemoErrorBoundary extends Component<
  DemoErrorBoundaryProps,
  DemoErrorBoundaryState
> {
  constructor(props: DemoErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): DemoErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // Basic logging for client-side runtime errors
    console.error("Visualization error boundary caught an error", error, info);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided, otherwise use DemoError component
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <DemoError error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}
