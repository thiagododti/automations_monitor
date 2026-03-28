import { useState } from 'react';
import { Activity } from 'lucide-react';
import type { AutomationsStatus } from '@/features/automations/types';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/formatters';
import { ExecutionDetailsDialog } from './ExecutionDetailsDialog';

interface AutomationStatusMonitorProps {
    statuses: AutomationsStatus[];
    isRefreshing?: boolean;
}

export function AutomationStatusMonitor({ statuses, isRefreshing = false }: AutomationStatusMonitorProps) {
    const [selectedAutomation, setSelectedAutomation] = useState<AutomationsStatus | null>(null);

    const sortedStatuses = [...statuses].sort((a, b) => {
        if (!a.last_date_start && !b.last_date_start) return b.id - a.id;
        if (!a.last_date_start) return 1;
        if (!b.last_date_start) return -1;
        return new Date(b.last_date_start).getTime() - new Date(a.last_date_start).getTime();
    });

    const handleOpenDetails = (automation: AutomationsStatus) => {
        if (!automation.last_execution_id) return;
        setSelectedAutomation(automation);
    };

    const handleDialogOpenChange = (open: boolean) => {
        if (!open) {
            setSelectedAutomation(null);
        }
    };

    return (
        <div className="rounded-lg border border-border bg-card p-5 shadow-surface-sm">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-medium text-foreground">Monitoramento em tempo real</h2>
                    <p className="text-xs text-muted-foreground">Atualização automática a cada 10 segundos</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Activity className={`h-4 w-4 ${isRefreshing ? 'animate-pulse text-primary' : ''}`} />
                    {isRefreshing ? 'Atualizando...' : 'Online'}
                </div>
            </div>

            {sortedStatuses.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma automação encontrada para monitoramento.</p>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    {sortedStatuses.map((automation) => (
                        <div
                            key={automation.id}
                            role={automation.last_execution_id ? 'button' : undefined}
                            tabIndex={automation.last_execution_id ? 0 : -1}
                            aria-disabled={!automation.last_execution_id}
                            onClick={() => handleOpenDetails(automation)}
                            onKeyDown={(event) => {
                                if (!automation.last_execution_id) return;
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    handleOpenDetails(automation);
                                }
                            }}
                            className={cn(
                                'rounded-md border border-border/70 bg-secondary/40 p-4 transition-colors',
                                automation.last_execution_id
                                    ? 'cursor-pointer hover:bg-secondary/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                    : 'opacity-80'
                            )}
                        >
                            <div className="mb-3 flex items-start justify-between gap-2">
                                <div>
                                    <p className="line-clamp-1 text-sm font-semibold text-foreground">{automation.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        ID #{automation.id} - Execução: {automation.last_execution_id ? `#${automation.last_execution_id}` : '—'}
                                    </p>
                                </div>
                                <StatusBadge status={automation.last_status || 'sem status'} />
                            </div>

                            <div className="space-y-1.5 text-xs text-muted-foreground">
                                <div className="flex items-center justify-between gap-2">
                                    <span>Início:</span>
                                    <span className="font-medium text-foreground/90">{formatDateTime(automation.last_date_start)}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <span>Fim:</span>
                                    <span className="font-medium text-foreground/90">{formatDateTime(automation.last_date_end)}</span>
                                </div>
                            </div>

                            <p className="mt-3 text-[11px] text-muted-foreground">
                                {automation.last_execution_id ? 'Clique para ver os detalhes da execução.' : 'Aguardando uma execução para exibir detalhes.'}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <ExecutionDetailsDialog
                automationStatus={selectedAutomation}
                open={!!selectedAutomation}
                onOpenChange={handleDialogOpenChange}
            />
        </div>
    );
}
