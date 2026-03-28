import { AlertTriangle, Bot, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogTable } from '@/features/logs/components/LogTable';
import { StepTable } from '@/features/steps/components/StepTable';
import { PaginationControls } from '@/shared/components/PaginationControls';
import { DetailItem } from '@/shared/components/DetailItem';
import { formatSeconds, formatCurrency, formatDateTime } from '@/lib/formatters';
import type { Execution } from '../types';
import type { PaginatedResponse } from '@/shared/types/api';
import type { Log } from '@/features/logs/types';
import type { Step } from '@/features/steps/types';

interface ExecutionTabsProps {
    execution: Execution;
    stepsData: PaginatedResponse<Step> | undefined;
    logsData: PaginatedResponse<Log> | undefined;
    isStepsLoading: boolean;
    isLogsLoading: boolean;
    isStepsError: boolean;
    isLogsError: boolean;
    stepsPage: number;
    logsPage: number;
    onStepsPageChange: (page: number) => void;
    onLogsPageChange: (page: number) => void;
}

export function ExecutionTabs({
    execution,
    stepsData,
    logsData,
    isStepsLoading,
    isLogsLoading,
    isStepsError,
    isLogsError,
    stepsPage,
    logsPage,
    onStepsPageChange,
    onLogsPageChange,
}: ExecutionTabsProps) {
    return (
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

            {/* ── Visão geral ── */}
            <TabsContent value="overview" className="space-y-4 pt-4">
                {/* Dados da execução */}
                <section className="rounded-lg border border-border bg-background/40 p-4">
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-foreground">Dados da execução</h3>
                        <p className="text-xs text-muted-foreground">Informações gerais desta execução.</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <DetailItem label="ID" value={`#${execution.id}`} mono />
                        <DetailItem label="Status" value={execution.status} />
                        <DetailItem label="Início" value={formatDateTime(execution.date_start)} mono />
                        <DetailItem label="Fim" value={formatDateTime(execution.date_end)} mono />
                        <DetailItem
                            label="Duração (robô)"
                            value={formatSeconds(execution.time_automation_seconds)}
                            mono
                        />
                        <DetailItem
                            label="Tempo manual equivalente"
                            value={formatSeconds(execution.time_manual_seconds)}
                            mono
                        />
                    </div>
                </section>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Dados da automação */}
                    <section className="rounded-lg border border-border bg-background/40 p-4">
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-foreground">Automação vinculada</h3>
                            <p className="text-xs text-muted-foreground">Detalhes da automação responsável por esta execução.</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <DetailItem label="ID" value={`#${execution.automation}`} mono />
                            <DetailItem label="Nome" value={execution.automation_data.name} />
                            {execution.automation_data.description && (
                                <div className="sm:col-span-2 rounded-md border border-border/70 bg-secondary/30 p-3">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Descrição</p>
                                    <p className="mt-1 text-sm text-foreground">{execution.automation_data.description}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Dados da empresa */}
                    <section className="rounded-lg border border-border bg-background/40 p-4">
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-foreground">Empresa vinculada</h3>
                            <p className="text-xs text-muted-foreground">Empresa associada a esta execução.</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <DetailItem label="Nome" value={execution.business_data?.name || '—'} />
                            <DetailItem label="CNPJ" value={execution.business_data?.cnpj || '—'} mono />
                        </div>
                    </section>
                </div>

                {/* Métricas detalhadas */}
                <section className="rounded-lg border border-border bg-background/40 p-4">
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-foreground">Métricas detalhadas</h3>
                        <p className="text-xs text-muted-foreground">Comparativo de tempo e custo entre automação e trabalho manual.</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-md border border-border/70 bg-secondary/30 p-3">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Tempo do robô</p>
                            <p className="mt-1 flex items-center gap-1.5 text-sm font-mono tabular-nums text-foreground">
                                <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                                {formatSeconds(execution.time_automation_seconds)}
                            </p>
                        </div>
                        <div className="rounded-md border border-border/70 bg-secondary/30 p-3">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Tempo manual</p>
                            <p className="mt-1 flex items-center gap-1.5 text-sm font-mono tabular-nums text-foreground">
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                {formatSeconds(execution.time_manual_seconds)}
                            </p>
                        </div>
                        <div className="rounded-md border border-border/70 bg-secondary/30 p-3">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">T. potencial economizado</p>
                            <p className="mt-1 text-sm font-mono tabular-nums text-green-500 font-medium">
                                {formatSeconds(execution.potential_time_seconds)}
                            </p>
                        </div>
                        <div className="rounded-md border border-border/70 bg-secondary/30 p-3">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">T. real economizado</p>
                            <p className="mt-1 text-sm font-mono tabular-nums text-muted-foreground">
                                {formatSeconds(execution.time_economy_seconds)}
                            </p>
                        </div>
                        <div className="rounded-md border border-border/70 bg-secondary/30 p-3">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Custo potencial economizado</p>
                            <p className="mt-1 text-sm font-mono tabular-nums text-green-500 font-medium">
                                {formatCurrency(execution.potential_cost)}
                            </p>
                        </div>
                        <div className="rounded-md border border-border/70 bg-secondary/30 p-3">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Custo real economizado</p>
                            <p className="mt-1 text-sm font-mono tabular-nums text-muted-foreground">
                                {formatCurrency(execution.cost_economy)}
                            </p>
                        </div>
                        <div className="rounded-md border border-border/70 bg-secondary/30 p-3">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Steps com sucesso</p>
                            <p className="mt-1 text-sm font-mono tabular-nums text-green-500 font-medium">
                                {execution.success_count} de {execution.step_counts}
                            </p>
                        </div>
                        <div className="rounded-md border border-border/70 bg-secondary/30 p-3">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Steps com erro</p>
                            <p className="mt-1 text-sm font-mono tabular-nums text-destructive font-medium">
                                {execution.error_count} de {execution.step_counts}
                            </p>
                        </div>
                    </div>
                </section>
            </TabsContent>

            {/* ── Steps ── */}
            <TabsContent value="steps" className="space-y-3 pt-4">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">Steps da execução</h3>
                    <p className="text-xs text-muted-foreground">Total encontrado: {stepsData?.count ?? 0}</p>
                </div>
                {isStepsError ? (
                    <div className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        Não foi possível carregar os steps desta execução.
                    </div>
                ) : (
                    <>
                        <StepTable data={stepsData} isLoading={isStepsLoading} />
                        {stepsData && (
                            <div className="px-4">
                                <PaginationControls count={stepsData.count} page={stepsPage} onPageChange={onStepsPageChange} />
                            </div>
                        )}
                    </>
                )}
            </TabsContent>

            {/* ── Logs ── */}
            <TabsContent value="logs" className="space-y-3 pt-4">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">Logs da execução</h3>
                    <p className="text-xs text-muted-foreground">Total encontrado: {logsData?.count ?? 0}</p>
                </div>
                {isLogsError ? (
                    <div className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        Não foi possível carregar os logs desta execução.
                    </div>
                ) : (
                    <>
                        <LogTable data={logsData} isLoading={isLogsLoading} />
                        {logsData && (
                            <div className="px-4">
                                <PaginationControls count={logsData.count} page={logsPage} onPageChange={onLogsPageChange} />
                            </div>
                        )}
                    </>
                )}
            </TabsContent>
        </Tabs>
    );
}
