import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    /** Fallback customizado. Se omitido, usa o UI padrão. */
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

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary]', error, info.componentStack);
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
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-7 w-7 text-destructive" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-base font-semibold text-foreground">
                            Algo deu errado
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Ocorreu um erro inesperado nesta página.
                        </p>
                        {this.state.error?.message && (
                            <p className="mt-2 rounded bg-secondary px-3 py-1.5 font-mono text-xs text-muted-foreground">
                                {this.state.error.message}
                            </p>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={this.handleReset}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Tentar novamente
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
