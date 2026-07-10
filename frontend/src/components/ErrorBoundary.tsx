import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const isDev = import.meta.env.DEV;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-6 text-destructive" />
            </div>
            <div>
              <CardTitle>خطایی رخ داد</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                متأسفانه برنامه با مشکل مواجه شد
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isDev && error && (
            <div
              dir="ltr"
              className="max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs text-muted-foreground"
            >
              <p className="font-semibold text-foreground">{error.name}</p>
              <p className="mt-1">{error.message}</p>
              {error.stack && (
                <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
              )}
            </div>
          )}
          {!isDev && (
            <p className="text-sm text-muted-foreground">
              لطفاً صفحه را بازخوانی کنید یا به داشبورد بازگردید.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="size-4" />
            بازخوانی صفحه
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
            <Home className="size-4" />
            بازگشت به داشبورد
          </Button>
          {onRetry && (
            <Button onClick={onRetry}>
              <RefreshCw className="size-4" />
              تلاش مجدد
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
