import type { Execution } from '@/types/automation';

function StatusDot({ status }: { status: string }) {
    const colors: Record<string, string> = {
        iniciado: 'bg-primary',
        concluido: 'bg-success',
        erro: 'bg-destructive',
        alerta: 'bg-warning',
    };
    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`h-2 w-2 rounded-full ${colors[status] || 'bg-muted-foreground'}`} />
            {status}
        </div>
    );
}

interface RecentExecutionsProps {
    executions: Execution[];
}

export function RecentExecutions({ executions }: RecentExecutionsProps) {
    return (
        <div className="rounded-lg border border-border bg-card p-5 shadow-surface-sm">
            <h2 className="text-sm font-medium text-foreground mb-4">Execuções Recentes</h2>
            {executions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma execução encontrada.</p>
            ) : (
                <div className="space-y-2">
                    {executions.slice(0, 5).map((exec) => (
                        <div
                            key={exec.id}
                            className="flex items-center justify-between rounded-md bg-secondary/50 px-4 py-2.5 text-sm"
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                                    #{exec.id}
                                </span>
                                <span className="text-foreground">{exec.automation_data.name}</span>
                            </div>
                            <StatusDot status={exec.status} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
