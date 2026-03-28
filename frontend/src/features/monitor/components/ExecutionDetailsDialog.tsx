import { useState } from 'react';
import { Loader2, Bot, User, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useExecution } from '@/features/executions/hooks';
import { useAutomation } from '@/features/automations/hooks';
import { useExecutionLogs } from '@/features/logs/hooks';
import { useExecutionSteps } from '@/features/steps/hooks';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { LogTable } from '@/features/logs/components/LogTable';
import { StepTable } from '@/features/steps/components/StepTable';
import { PaginationControls } from '@/shared/components/PaginationControls';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DetailItem } from '@/shared/components/DetailItem';
import { EfficiencyBadge } from '@/shared/components/EfficiencyBadge';
import type { AutomationsStatus } from '@/features/automations/types';
import { formatSeconds, formatCurrency, formatDateTime } from '@/lib/formatters';

interface ExecutionDetailsDialogProps {
    automationStatus: AutomationsStatus | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ExecutionDetailsDialog({ automationStatus, open, onOpenChange }: ExecutionDetailsDialogProps) {
    const executionId = automationStatus?.last_execution_id ?? 0;
    const automationId = automationStatus?.id ?? 0;
    const navigate = useNavigate();

    const [stepsPage, setStepsPage] = useState(1);
    const [logsPage, setLogsPage] = useState(1);

    // Passa id=0 quando o dialog está fechado — os hooks têm enabled:!!id internamente
    const activeExecutionId = open ? executionId : 0;
    const activeAutomationId = open ? automationId : 0;

    const {
        data: execution,
        isLoading: isExecutionLoading,
        isError: isExecutionError,
    } = useExecution(activeExecutionId);

    const {
        data: automation,
        isLoading: isAutomationLoading,
        isError: isAutomationError,
    } = useAutomation(activeAutomationId);

    const {
        data: logsData,
        isLoading: isLogsLoading,
        isError: isLogsError,
    } = useExecutionLogs(activeExecutionId, logsPage);

    const {
        data: stepsData,
        isLoading: isStepsLoading,
        isError: isStepsError,
    } = useExecutionSteps(activeExecutionId, stepsPage);

    const isOverviewLoading = (isExecutionLoading || isAutomationLoading) && !execution && !automation;

    function handleViewFull() {
        onOpenChange(false);
        navigate(`/executions/${executionId}`);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden border-border bg-card sm:max-w-5xl">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-3 pr-6">
                        <div>
                            <DialogTitle className="text-foreground">
                                {executionId ? `Execução #${executionId}` : 'Detalhes da execução'}
                            </DialogTitle>
                            <DialogDescription>
                                Dados da execução atual, logs, steps e informações da automação relacionada.
                            </DialogDescription>
                        </div>
                        {!!executionId && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleViewFull}
                                className="shrink-0 gap-1.5 text-xs"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Ver página completa
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                {!executionId ? (
                    <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
                        Nenhuma execução disponível para esta automação no momento.
                    </div>
                ) : (
                    <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-thin">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="overview">Visão geral</TabsTrigger>
                                <TabsTrigger value="steps">
                                    Steps {stepsData ? `(${stepsData.count})` : ''}
                                </TabsTrigger>
                                <TabsTrigger value="logs">
                                    Logs {logsData ? `(${logsData.count})` : ''}
                                </TabsTrigger>
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
                                        {/* Metric summary strip */}
                                        {execution && (
                                            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                                <div className="rounded-lg border border-border bg-background/40 p-3">
                                                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Steps</p>
                                                    <p className="mt-1 text-sm font-mono tabular-nums font-semibold text-foreground">
                                                        <span className="text-green-500">{execution.success_count} ?</span>
                                                        <span className="text-muted-foreground mx-1">·</span>
                                                        <span className="text-destructive">{execution.error_count} ?</span>
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-muted-foreground/70">{execution.step_counts} no total</p>
                                                </div>
                                                <div className="rounded-lg border border-border bg-background/40 p-3">
                                                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Eficiência</p>
                                                    <p className="mt-1 text-sm font-semibold">
                                                        <EfficiencyBadge value={execution.efficiency_percent} />
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-muted-foreground/70">
                                                        {parseFloat(execution.efficiency_percent) >= 100 ? 'Robô mais ágil' : 'Performance moderada'}
                                                    </p>
                                                </div>
                                                <div className="rounded-lg border border-border bg-background/40 p-3">
                                                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">T. economizado</p>
                                                    <p className="mt-1 text-sm font-mono tabular-nums font-semibold text-green-500">
                                                        {formatSeconds(execution.potential_time_seconds)}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-muted-foreground/70 font-mono tabular-nums">
                                                        real {formatSeconds(execution.time_economy_seconds)}
                                                    </p>
                                                </div>
                                                <div className="rounded-lg border border-border bg-background/40 p-3">
                                                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Custo economizado</p>
                                                    <p className="mt-1 text-sm font-mono tabular-nums font-semibold text-green-500">
                                                        {formatCurrency(execution.potential_cost)}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-muted-foreground/70 font-mono tabular-nums">
                                                        real {formatCurrency(execution.cost_economy)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid gap-4 lg:grid-cols-2">
                                            <section className="rounded-lg border border-border bg-background/40 p-4">
                                                <div className="mb-4 flex items-start justify-between gap-3">
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-foreground">Execução</h3>
                                                        <p className="text-xs text-muted-foreground">
                                                            Informações gerais desta execução.
                                                        </p>
                                                    </div>
                                                    <StatusBadge status={execution?.status || automationStatus?.last_status || 'sem status'} />
                                                </div>

                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <DetailItem label="ID" value={`#${execution?.id ?? executionId}`} mono />
                                                    <DetailItem label="Status" value={execution?.status || automationStatus?.last_status || '--'} />
                                                    <DetailItem label="Início" value={formatDateTime(execution?.date_start ?? automationStatus?.last_date_start)} mono />
                                                    <DetailItem label="Fim" value={formatDateTime(execution?.date_end ?? automationStatus?.last_date_end)} mono />
                                                    <DetailItem
                                                        label="Robô"
                                                        value={execution ? formatSeconds(execution.time_automation_seconds) : '--'}
                                                        mono
                                                    />
                                                    <DetailItem
                                                        label="Tempo manual"
                                                        value={execution ? formatSeconds(execution.time_manual_seconds) : '--'}
                                                        mono
                                                    />
                                                </div>

                                                {execution?.business_data && (
                                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                                        <DetailItem label="Empresa" value={execution.business_data.name || '--'} />
                                                        <DetailItem label="CNPJ" value={execution.business_data.cnpj || '--'} mono />
                                                    </div>
                                                )}
                                            </section>

                                            <section className="rounded-lg border border-border bg-background/40 p-4">
                                                <div className="mb-4">
                                                    <h3 className="text-sm font-semibold text-foreground">Automação relacionada</h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        Dados da automação vinculada à execução.
                                                    </p>
                                                </div>

                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <DetailItem label="ID" value={`#${automation?.id ?? automationId}`} mono />
                                                    <DetailItem label="Status" value={automation?.is_active ? 'Ativa' : 'Inativa'} />
                                                    <DetailItem label="Nome" value={automation?.name || automationStatus?.name || '--'} />
                                                    <DetailItem label="Departamento" value={automation?.department_data?.name || '--'} />
                                                    <DetailItem
                                                        label="Tempo manual"
                                                        value={automation ? formatSeconds(automation.manual_time) : '--'}
                                                        mono
                                                    />
                                                    <DetailItem
                                                        label="Atualizado por"
                                                        value={automation?.updated_by_data
                                                            ? `${automation.updated_by_data.first_name} ${automation.updated_by_data.last_name}`
                                                            : '--'}
                                                    />
                                                </div>

                                                <div className="mt-3 rounded-md border border-border/70 bg-secondary/20 p-3">
                                                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Descrição</p>
                                                    <p className="mt-1 text-sm text-foreground">
                                                        {automation?.description || execution?.automation_data?.description || '--'}
                                                    </p>
                                                </div>
                                            </section>
                                        </div>
                                    </>
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
                                    <>
                                        <StepTable data={stepsData} isLoading={isStepsLoading} />
                                        {stepsData && (
                                            <div className="px-4">
                                                <PaginationControls count={stepsData.count} page={stepsPage} onPageChange={setStepsPage} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </TabsContent>

                            <TabsContent value="logs" className="space-y-3 pt-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">Logs da execução</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Total encontrado: {logsData?.count ?? 0}
                                    </p>
                                </div>

                                {isLogsError ? (
                                    <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                                        Não foi possível carregar os logs desta execução.
                                    </div>
                                ) : (
                                    <>
                                        <LogTable data={logsData} isLoading={isLogsLoading} />
                                        {logsData && (
                                            <div className="px-4">
                                                <PaginationControls count={logsData.count} page={logsPage} onPageChange={setLogsPage} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
