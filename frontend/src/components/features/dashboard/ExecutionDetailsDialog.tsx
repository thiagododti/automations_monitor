import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { automationsApi } from '@/api/automations';
import { executionsApi } from '@/api/executions';
import { logsApi } from '@/api/logs';
import { stepsApi } from '@/api/steps';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LogTable } from '@/components/features/Logs_page/LogTable';
import { StepTable } from '@/components/features/steps/StepTable';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AutomationsStatus } from '@/types/automation';

interface ExecutionDetailsDialogProps {
    automationStatus: AutomationsStatus | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface DetailItemProps {
    label: string;
    value: string;
    mono?: boolean;
}

function formatDateTime(value: string | null | undefined) {
    if (!value) return '--';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';

    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

function DetailItem({ label, value, mono = false }: DetailItemProps) {
    return (
        <div className="rounded-md border border-border/70 bg-secondary/30 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className={`mt-1 text-sm text-foreground ${mono ? 'font-mono tabular-nums' : ''}`}>{value}</p>
        </div>
    );
}

export function ExecutionDetailsDialog({ automationStatus, open, onOpenChange }: ExecutionDetailsDialogProps) {
    const executionId = automationStatus?.last_execution_id ?? 0;
    const automationId = automationStatus?.id ?? 0;

    const {
        data: execution,
        isLoading: isExecutionLoading,
        isError: isExecutionError,
    } = useQuery({
        queryKey: ['executions', 'detail', executionId],
        queryFn: () => executionsApi.getById(executionId).then((res) => res.data),
        enabled: open && !!executionId,
    });

    const {
        data: automation,
        isLoading: isAutomationLoading,
        isError: isAutomationError,
    } = useQuery({
        queryKey: ['automations', 'detail', automationId],
        queryFn: () => automationsApi.getById(automationId).then((res) => res.data),
        enabled: open && !!automationId,
    });

    const {
        data: logsData,
        isLoading: isLogsLoading,
        isError: isLogsError,
    } = useQuery({
        queryKey: ['executions', executionId, 'logs'],
        queryFn: () => logsApi.list({ execution: String(executionId), page: 1 }).then((res) => res.data),
        enabled: open && !!executionId,
    });

    const {
        data: stepsData,
        isLoading: isStepsLoading,
        isError: isStepsError,
    } = useQuery({
        queryKey: ['executions', executionId, 'steps'],
        queryFn: () => stepsApi.list({ execution: String(executionId), page: 1 }).then((res) => res.data),
        enabled: open && !!executionId,
    });

    const isOverviewLoading = (isExecutionLoading || isAutomationLoading) && !execution && !automation;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-hidden border-border bg-card sm:max-w-5xl">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {executionId ? `Execução #${executionId}` : 'Detalhes da execução'}
                    </DialogTitle>
                    <DialogDescription>
                        Dados da execução atual, logs, steps e informações da automação relacionada.
                    </DialogDescription>
                </DialogHeader>

                {!executionId ? (
                    <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
                        Nenhuma execução disponível para esta automação no momento.
                    </div>
                ) : (
                    <div className="overflow-y-auto pr-1">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="overview">Visão geral</TabsTrigger>
                                <TabsTrigger value="logs">Logs</TabsTrigger>
                                <TabsTrigger value="steps">Steps</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4 pt-4">
                                {isOverviewLoading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : isExecutionError || isAutomationError ? (
                                    <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                                        Não foi possível carregar os detalhes da execução selecionada.
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid gap-4 lg:grid-cols-2">
                                            <section className="rounded-lg border border-border bg-background/40 p-4">
                                                <div className="mb-4 flex items-start justify-between gap-3">
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-foreground">Execução atual</h3>
                                                        <p className="text-xs text-muted-foreground">
                                                            Informações retornadas pelo endpoint de execuções.
                                                        </p>
                                                    </div>
                                                    <StatusBadge status={execution?.status || automationStatus?.last_status || 'sem status'} />
                                                </div>

                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <DetailItem
                                                        label="ID da execução"
                                                        value={`#${execution?.id ?? executionId}`}
                                                        mono
                                                    />
                                                    <DetailItem
                                                        label="Status"
                                                        value={execution?.status || automationStatus?.last_status || '--'}
                                                    />
                                                    <DetailItem
                                                        label="Início"
                                                        value={formatDateTime(execution?.date_start ?? automationStatus?.last_date_start)}
                                                        mono
                                                    />
                                                    <DetailItem
                                                        label="Fim"
                                                        value={formatDateTime(execution?.date_end ?? automationStatus?.last_date_end)}
                                                        mono
                                                    />
                                                    <DetailItem
                                                        label="Automação vinculada"
                                                        value={execution?.automation_data?.name || automationStatus?.name || '--'}
                                                    />
                                                    <DetailItem
                                                        label="Resumo rápido"
                                                        value={`${stepsData?.count ?? 0} step(s) e ${logsData?.count ?? 0} log(s)`}
                                                    />
                                                </div>
                                            </section>

                                            <section className="rounded-lg border border-border bg-background/40 p-4">
                                                <div className="mb-4">
                                                    <h3 className="text-sm font-semibold text-foreground">Automação relacionada</h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        Dados completos da automação vinculada à execução.
                                                    </p>
                                                </div>

                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <DetailItem
                                                        label="ID da automação"
                                                        value={`#${automation?.id ?? automationId}`}
                                                        mono
                                                    />
                                                    <DetailItem
                                                        label="Status"
                                                        value={automation?.is_active ? 'Ativa' : 'Inativa'}
                                                    />
                                                    <DetailItem
                                                        label="Nome"
                                                        value={automation?.name || automationStatus?.name || '--'}
                                                    />
                                                    <DetailItem
                                                        label="Departamento"
                                                        value={automation?.department_data?.name || '--'}
                                                    />
                                                    <DetailItem
                                                        label="Tempo manual"
                                                        value={automation ? `${automation.manual_time}s` : '--'}
                                                    />
                                                    <DetailItem
                                                        label="Atualizado por"
                                                        value={automation?.updated_by_data
                                                            ? `${automation.updated_by_data.first_name} ${automation.updated_by_data.last_name}`
                                                            : '--'}
                                                    />
                                                </div>

                                                <div className="mt-3 rounded-md border border-border/70 bg-secondary/20 p-3">
                                                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                                        Descrição
                                                    </p>
                                                    <p className="mt-1 text-sm text-foreground">
                                                        {automation?.description || execution?.automation_data?.description || '--'}
                                                    </p>
                                                </div>
                                            </section>
                                        </div>
                                    </>
                                )}
                            </TabsContent>

                            <TabsContent value="logs" className="space-y-3 pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground">Logs da execução</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Total encontrado: {logsData?.count ?? 0}
                                        </p>
                                    </div>
                                </div>

                                {isLogsError ? (
                                    <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                                        Não foi possível carregar os logs desta execução.
                                    </div>
                                ) : (
                                    <LogTable data={logsData} isLoading={isLogsLoading} />
                                )}
                            </TabsContent>

                            <TabsContent value="steps" className="space-y-3 pt-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">Steps da execução</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Total encontrado: {stepsData?.count ?? 0}
                                    </p>
                                </div>

                                {isStepsError ? (
                                    <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                                        Não foi possível carregar os steps desta execução.
                                    </div>
                                ) : (
                                    <StepTable data={stepsData} isLoading={isStepsLoading} />
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}