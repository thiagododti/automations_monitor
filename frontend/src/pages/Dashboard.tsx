import { useMemo, useState } from 'react';
import { AlertCircle, Bot, CircleDollarSign, Clock3, Gauge, Loader2, PlayCircle, ShieldAlert, TrendingUp } from 'lucide-react';
import { useAutomations } from '@/features/automations/hooks';
import { useBusinessOptions } from '@/features/business/hooks';
import { useEvolution, useKpis, useKpisByAutomation } from '@/features/dashboard/hooks';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FilterBar } from '@/shared/components/FilterBar';
import type { FilterField } from '@/shared/types/filters';
import type { EvolutionFilters, KPiFilters, KpisByAutomationFilters } from '@/features/dashboard/types';
import { dashboardStatusFilter, dashboardDateFromFilter, dashboardDateToFilter } from '@/features/dashboard';
import { type GroupBy, formatCurrency, formatPercent, formatCompactSeconds } from '@/lib/formatters';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { EvolutionChart } from '@/features/dashboard/components/EvolutionChart';
import { KpisByAutomationTable } from '@/features/dashboard/components/KpisByAutomationTable';

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
            dashboardStatusFilter,
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
            dashboardDateFromFilter,
            dashboardDateToFilter,
        ],
        [businessOptions, automationsData?.results],
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

            <EvolutionChart data={evolution} groupBy={filters.group_by} isLoading={loadingEvolution} />

            <KpisByAutomationTable data={kpisByAutomation} isLoading={loadingByAutomation} />
        </div>
    );
}
