import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/shared/components/StatusBadge';
import type { Execution } from '../types';

interface ExecutionHeaderProps {
    execution: Execution;
    onBack: () => void;
}

export function ExecutionHeader({ execution, onBack }: ExecutionHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="mb-1 gap-2 text-muted-foreground hover:text-foreground -ml-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Execuções
                </Button>
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-semibold text-foreground">
                        Execução <span className="font-mono">#{execution.id}</span>
                    </h1>
                    <StatusBadge status={execution.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                    {execution.automation_data.name}
                    {execution.business_data?.name ? ` · ${execution.business_data.name}` : ''}
                </p>
            </div>
        </div>
    );
}
