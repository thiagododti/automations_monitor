import { formatSeconds, formatCurrency } from '@/lib/formatters';
import { MetricCard, EfficiencyCard } from './ExecutionDetailCards';
import type { Execution } from '../types';

interface ExecutionMetricsProps {
    execution: Execution;
}

export function ExecutionMetrics({ execution }: ExecutionMetricsProps) {
    return (
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
    );
}
