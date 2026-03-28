import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExecutionDetail } from '@/features/executions/hooks';
import { ExecutionHeader } from '@/features/executions/components/ExecutionHeader';
import { ExecutionMetrics } from '@/features/executions/components/ExecutionMetrics';
import { ExecutionTabs } from '@/features/executions/components/ExecutionTabs';

export default function ExecutionDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const executionId = Number(id);

    const {
        execution,
        isExecutionLoading,
        isExecutionError,
        logsData,
        isLogsLoading,
        isLogsError,
        stepsData,
        isStepsLoading,
        isStepsError,
        stepsPage,
        setStepsPage,
        logsPage,
        setLogsPage,
    } = useExecutionDetail(executionId);

    if (isExecutionLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isExecutionError || !execution) {
        return (
            <div className="space-y-6 animate-fade-in">
                <Button variant="ghost" size="sm" onClick={() => navigate('/executions')} className="gap-2 text-muted-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para Execuções
                </Button>
                <div className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-destructive">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <p className="text-sm">Não foi possível carregar os detalhes da execução #{executionId}.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <ExecutionHeader execution={execution} onBack={() => navigate('/executions')} />
            <ExecutionMetrics execution={execution} />
            <ExecutionTabs
                execution={execution}
                stepsData={stepsData}
                logsData={logsData}
                isStepsLoading={isStepsLoading}
                isLogsLoading={isLogsLoading}
                isStepsError={isStepsError}
                isLogsError={isLogsError}
                stepsPage={stepsPage}
                logsPage={logsPage}
                onStepsPageChange={setStepsPage}
                onLogsPageChange={setLogsPage}
            />
        </div>
    );
}
