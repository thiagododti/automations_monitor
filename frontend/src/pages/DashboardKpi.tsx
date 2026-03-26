import { useMemo, useState } from 'react';
import { AlertCircle, Bot, CircleDollarSign, Clock3, Gauge, Loader2, PlayCircle, ShieldAlert, TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { useAutomations } from '@/hooks/useAutomations';
import { useBusinessOptions } from '@/hooks/useBusiness';
import { useEvolution, useKpis, useKpisByAutomation } from '@/hooks/useDashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { FilterBar, type FilterField } from '@/components/shared/FilterBar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { EvolutionFilters, KPiFilters, KpisByAutomationFilters } from '@/types/dashboard';
import { DateFromFilter, DateToFilter, StatusFilters } from '@/filters/filters';

type GroupBy = 'day' | 'week' | 'month';

interface DashboardFilters {
    business?: number;
    automation?: number;
    status?: string;
    date_from?: string;
    date_to?: string;
    group_by: GroupBy;
}

const INITIAL_FILTERS: DashboardFilters = {
    group_by: 'month',
};

const chartConfig = {
    executions: { label: 'Execuções', color: 'hsl(var(--primary))' },
    efficiency: { label: 'Eficiência (%)', color: 'hsl(var(--success))' },
    costEconomy: { label: 'Economia (R$)', color: 'hsl(var(--warning))' },
} satisfies ChartConfig;

function toNumber(value: string | number | undefined): number {
    if (typeof value === 'number') return value;
    if (!value) return 0;

    if (value.includes('.') && value.includes(',')) {
        const normalized = value.replace(/\./g, '').replace(',', '.');
        const n = Number(normalized);
        return Number.isFinite(n) ? n : 0;
    }

    if (value.includes(',')) {
        const n = Number(value.replace(',', '.'));
        return Number.isFinite(n) ? n : 0;
    }

    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

function formatCurrency(value: string | number | undefined): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 2,
    }).format(toNumber(value));
}

function formatPercent(value: string | number | undefined): string {
    return `${toNumber(value).toFixed(1)}%`;
}

function formatCompactSeconds(seconds: number | undefined): string {
    const totalSeconds = Math.max(0, Math.floor(seconds || 0));
    const totalMinutes = Math.floor(totalSeconds / 60);

    if (totalMinutes < 60) return `${totalMinutes} min`;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours < 24) return `${hours}h ${minutes}min`;

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
}

function formatPeriod(period: string, groupBy: GroupBy): string {
    const date = new Date(`${period}T00:00:00`);
    if (Number.isNaN(date.getTime())) return period;

    if (groupBy === 'day') {
        return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date);
    }

    if (groupBy === 'week') {
        return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date);
    }

    return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' }).format(date);
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: {
    title: string;
    value: string;
    description: string;
    icon: React.ElementType;
}) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                    <CardDescription>{title}</CardDescription>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold tabular-nums text-foreground">{value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

export default function DashboardKpiPage() {
    const [filters, setFilters] = useState<DashboardFilters>(INITIAL_FILTERS);

    const { data: businessOptions = [] } = useBusinessOptions(true);
    const { data: automationsData } = useAutomations(undefined, 1);

    const kpiFilters = useMemo<KPiFilters>(
        () => ({
            business: filters.business,
            automation: filters.automation,
            status: filters.status,
            date_from: filters.date_from,
            date_to: filters.date_to,
        }),
        [filters.business, filters.automation, filters.status, filters.date_from, filters.date_to],
    );

    const byAutomationFilters = useMemo<KpisByAutomationFilters>(
        () => ({
            business: filters.business,
            status: filters.status,
            date_from: filters.date_from,
            date_to: filters.date_to,
        }),
        [filters.business, filters.status, filters.date_from, filters.date_to],
    );

    const evolutionFilters = useMemo<EvolutionFilters>(
        () => ({
            business: filters.business,
            automation: filters.automation,
            status: filters.status,
            date_from: filters.date_from,
            date_to: filters.date_to,
            group_by: filters.group_by,
        }),
        [filters.business, filters.automation, filters.status, filters.date_from, filters.date_to, filters.group_by],
    );

    const {
        data: kpis,
        isLoading: loadingKpis,
        error: kpisError,
    } = useKpis(kpiFilters);

    const {
        data: kpisByAutomation = [],
        isLoading: loadingByAutomation,
        error: byAutomationError,
    } = useKpisByAutomation(byAutomationFilters);

    const {
        data: evolution = [],
        isLoading: loadingEvolution,
        error: evolutionError,
    } = useEvolution(evolutionFilters);

    const hasAnyError = Boolean(kpisError || byAutomationError || evolutionError);
    const isInitialLoading = loadingKpis && loadingByAutomation && loadingEvolution;

    const filterFields = useMemo<FilterField[]>(
        () => [
            {
                key: 'business',
                label: 'Empresa',
                type: 'select',
                options: businessOptions.map((business) => ({
                    value: String(business.id),
                    label: business.name,
                })),
                placeholder: 'Todas',
            },
            {
                key: 'automation',
                label: 'Automação',
                type: 'select',
                options: (automationsData?.results || []).map((automation) => ({
                    value: String(automation.id),
                    label: automation.name,
                })),
                placeholder: 'Todas',
            },
            StatusFilters,
            {
                key: 'group_by',
                label: 'Agrupar por',
                type: 'select',
                options: [
                    { value: 'day', label: 'Dia' },
                    { value: 'week', label: 'Semana' },
                    { value: 'month', label: 'Mês' },
                ],
                placeholder: 'Mês',
            },
            DateFromFilter,
            DateToFilter,
        ],
        [businessOptions, automationsData?.results],
    );

    const chartData = useMemo(
        () =>
            evolution.map((item) => ({
                periodLabel: formatPeriod(item.period, filters.group_by),
                executions: item.total_executions,
                efficiency: toNumber(item.avg_efficiency_percent),
                costEconomy: toNumber(item.total_cost_economy),
            })),
        [evolution, filters.group_by],
    );

    if (isInitialLoading && !kpis) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-lg font-semibold text-foreground">Dashboard de KPIs</h1>
                <p className="text-sm text-muted-foreground">Valor gerado pelas automações: tempo, custo e eficiência</p>
            </div>

            <FilterBar
                fields={filterFields}
                onFilter={(values) => {
                    setFilters({
                        business: values.business ? Number(values.business) : undefined,
                        automation: values.automation ? Number(values.automation) : undefined,
                        status: values.status || undefined,
                        date_from: values.date_from || undefined,
                        date_to: values.date_to || undefined,
                        group_by: (values.group_by as GroupBy) || 'month',
                    });
                }}
                onClear={() => setFilters(INITIAL_FILTERS)}
            />

            {hasAnyError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Falha ao carregar indicadores</AlertTitle>
                    <AlertDescription>
                        Não foi possível buscar todos os dados do dashboard. Tente ajustar os filtros ou recarregar a página.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Execuções Totais"
                    value={(kpis?.total_executions || 0).toLocaleString('pt-BR')}
                    description="Rodadas completas executadas"
                    icon={PlayCircle}
                />
                <StatCard
                    title="Tempo Economizado"
                    value={formatCompactSeconds(kpis?.total_time_economy_seconds)}
                    description="Tempo poupado frente ao processo manual"
                    icon={Clock3}
                />
                <StatCard
                    title="Economia Financeira"
                    value={formatCurrency(kpis?.total_cost_economy)}
                    description="Valor economizado em BRL"
                    icon={CircleDollarSign}
                />
                <StatCard
                    title="Eficiência Média"
                    value={formatPercent(kpis?.avg_efficiency_percent)}
                    description="Acima de 100% = automação mais rápida"
                    icon={Gauge}
                />
                <StatCard
                    title="Custo Potencial Evitado"
                    value={formatCurrency(kpis?.total_potential_cost)}
                    description="Custo total se fosse manual"
                    icon={TrendingUp}
                />
                <StatCard
                    title="Tempo Potencial Manual"
                    value={formatCompactSeconds(kpis?.total_potential_time_seconds)}
                    description="Tempo que seria gasto por pessoas"
                    icon={Bot}
                />
                <StatCard
                    title="Etapas com Sucesso"
                    value={(kpis?.total_success || 0).toLocaleString('pt-BR')}
                    description="Total de etapas concluídas"
                    icon={TrendingUp}
                />
                <StatCard
                    title="Erros Acumulados"
                    value={(kpis?.total_errors || 0).toLocaleString('pt-BR')}
                    description="Total de etapas com falha"
                    icon={ShieldAlert}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Evolução Temporal</CardTitle>
                    <CardDescription>
                        Tendência de execuções, eficiência e economia no período selecionado ({filters.group_by})
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingEvolution ? (
                        <div className="flex h-[320px] items-center justify-center">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : chartData.length === 0 ? (
                        <div className="h-[320px] rounded-md border border-dashed border-border/70 text-sm text-muted-foreground flex items-center justify-center">
                            Sem dados para o período selecionado.
                        </div>
                    ) : (
                        <ChartContainer className="h-[320px] w-full" config={chartConfig}>
                            <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="periodLabel" tickLine={false} axisLine={false} minTickGap={24} />
                                <YAxis yAxisId="left" tickLine={false} axisLine={false} allowDecimals={false} width={44} />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    tickLine={false}
                                    axisLine={false}
                                    width={52}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                                <Line yAxisId="left" type="monotone" dataKey="executions" stroke="var(--color-executions)" strokeWidth={2} dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="var(--color-efficiency)" strokeWidth={2} dot={false} />
                                <Line yAxisId="left" type="monotone" dataKey="costEconomy" stroke="var(--color-costEconomy)" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">KPIs por Automação</CardTitle>
                    <CardDescription>Ranking de performance individual das automações (ordenado por execuções)</CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingByAutomation ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : kpisByAutomation.length === 0 ? (
                        <div className="rounded-md border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
                            Nenhuma automação encontrada para os filtros selecionados.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Automação</TableHead>
                                    <TableHead className="text-right">Execuções</TableHead>
                                    <TableHead className="text-right">Eficiência</TableHead>
                                    <TableHead className="text-right">Economia</TableHead>
                                    <TableHead className="text-right">Custo Evitado</TableHead>
                                    <TableHead className="text-right">Tempo Economizado</TableHead>
                                    <TableHead className="text-right">Erros</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {kpisByAutomation.map((item) => (
                                    <TableRow key={item.automation_id}>
                                        <TableCell className="font-medium">{item.automation_name}</TableCell>
                                        <TableCell className="text-right tabular-nums">{item.total_executions.toLocaleString('pt-BR')}</TableCell>
                                        <TableCell className="text-right tabular-nums">{formatPercent(item.avg_efficiency_percent)}</TableCell>
                                        <TableCell className="text-right tabular-nums">{formatCurrency(item.total_cost_economy)}</TableCell>
                                        <TableCell className="text-right tabular-nums">{formatCurrency(item.total_potential_cost)}</TableCell>
                                        <TableCell className="text-right tabular-nums">{formatCompactSeconds(item.total_time_economy_seconds)}</TableCell>
                                        <TableCell className="text-right tabular-nums">{item.total_errors.toLocaleString('pt-BR')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
