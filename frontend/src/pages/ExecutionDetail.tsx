import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Bot, User, Loader2, AlertTriangle } from 'lucide-react';
import { executionsApi } from '@/api/executions';
import { logsApi } from '@/api/logs';
import { stepsApi } from '@/api/steps';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LogTable } from '@/components/features/Logs_page/LogTable';
import { StepTable } from '@/components/features/steps/StepTable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaginationControls } from '@/components/shared/PaginationControls';

function formatSeconds(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatCurrency(value: string): string {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateTime(value: string | null | undefined) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

function DetailItem({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="rounded-md border border-border/70 bg-secondary/30 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className={`mt-1 text-sm text-foreground ${mono ? 'font-mono tabular-nums' : ''}`}>{value}</p>
        </div>
    );
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
        <div className="rounded-lg border border-border bg-card p-4 shadow-surface-sm">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-1 text-lg font-semibold text-foreground font-mono tabular-nums">{value}</p>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground/70 font-mono tabular-nums">{sub}</p>}
        </div>
    );
}

function EfficiencyCard({ value }: { value: string }) {
    const num = parseFloat(value);
    const colorClass =
        num >= 100
            ? 'text-green-500'
            : num >= 50
                ? 'text-yellow-500'
                : 'text-destructive';
    return (
        <div className="rounded-lg border border-border bg-card p-4 shadow-surface-sm">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Eficiência</p>
            <p className={`mt-1 text-lg font-semibold font-mono tabular-nums ${colorClass}`}>
                {isNaN(num) ? value : `${num.toFixed(1)}%`}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground/70">
                {num >= 100 ? 'Robô mais ágil que o humano' : num >= 50 ? 'Performance moderada' : 'Humano ainda mais rápido'}
            </p>
        </div>
    );
}

export default function ExecutionDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const executionId = Number(id);

    const [stepsPage, setStepsPage] = useState(1);
    const [logsPage, setLogsPage] = useState(1);

    const {
        data: execution,
        isLoading: isExecutionLoading,
        isError: isExecutionError,
    } = useQuery({
        queryKey: ['executions', executionId],
        queryFn: () => executionsApi.getById(executionId).then((res) => res.data),
        enabled: !!executionId,
    });

    const {
        data: logsData,
        isLoading: isLogsLoading,
        isError: isLogsError,
    } = useQuery({
        queryKey: ['executions', executionId, 'logs', logsPage],
        queryFn: () => logsApi.list({ execution: String(executionId), page: logsPage }).then((res) => res.data),
        enabled: !!executionId,
    });

    const {
        data: stepsData,
        isLoading: isStepsLoading,
        isError: isStepsError,
    } = useQuery({
        queryKey: ['executions', executionId, 'steps', stepsPage],
        queryFn: () => stepsApi.list({ execution: String(executionId), page: stepsPage }).then((res) => res.data),
        enabled: !!executionId,
    });

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
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/executions')}
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

            {/* Metric cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    label="Steps"
                    value={`${execution.success_count} ✓ · ${execution.error_count} ✗`}
                    sub={`${execution.step_counts} no total`}
                />
                <EfficiencyCard value={execution.efficiency_percent} />
                <MetricCard
                    label="Tempo economizado"
                    value={formatSeconds(execution.potential_time_seconds)}
                    sub={`real ${formatSeconds(execution.time_economy_seconds)}`}
                />
                <MetricCard
                    label="Custo economizado"
                    value={formatCurrency(execution.potential_cost)}
                    sub={`real ${formatCurrency(execution.cost_economy)}`}
                />
            </div>

            {/* Tabs */}
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
                                <DetailItem
                                    label="Nome"
                                    value={execution.automation_data.name}
                                />
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
                                    <PaginationControls count={stepsData.count} page={stepsPage} onPageChange={setStepsPage} />
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
                                    <PaginationControls count={logsData.count} page={logsPage} onPageChange={setLogsPage} />
                                </div>
                            )}
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
