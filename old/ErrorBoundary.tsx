import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-3 sm:p-4">
          <Card className="w-full max-w-sm sm:max-w-md bg-gray-800 border-gray-700">
            <CardHeader className="text-center p-4 sm:p-6">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              </div>
              <CardTitle className="text-lg sm:text-xl font-semibold text-white">
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <p className="text-sm sm:text-base text-gray-400 text-center leading-relaxed">
                The application encountered an unexpected error. This might be
                due to:
              </p>
              <ul className="text-xs sm:text-sm text-gray-400 space-y-1 pl-3 sm:pl-4">
                <li>• Missing or invalid API key</li>
                <li>• Network connectivity issues</li>
                <li>• API service temporarily unavailable</li>
              </ul>

              {this.state.error && (
                <details className="bg-gray-900 p-2 sm:p-3 rounded border border-gray-600">
                  <summary className="text-xs sm:text-sm text-gray-400 cursor-pointer">
                    Error Details
                  </summary>
                  <pre className="text-[10px] sm:text-xs text-red-400 mt-2 whitespace-pre-wrap break-words">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <div className="flex flex-col gap-2">
                <Button
                  onClick={this.handleReset}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-sm sm:text-base py-2 sm:py-3"
                >
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 text-sm sm:text-base py-2 sm:py-3"
                >
                  Reload Page
                </Button>
              </div>

              <div className="text-[10px] sm:text-xs text-gray-500 text-center leading-relaxed px-2">
                If the problem persists, please check your .env file and ensure
                VITE_APY_KEY is set correctly.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
