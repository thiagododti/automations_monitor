import { Cpu, PlayCircle, AlertTriangle, CheckCircle2, TriangleAlert } from 'lucide-react';

function StatCard({
    label,
    value,
    icon: Icon,
    accent,
}: {
    label: string;
    value: string | number;
    icon: React.ElementType;
    accent?: string;
}) {
    return (
        <div className="rounded-lg border border-border bg-card p-5 shadow-surface-sm">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {label}
                </span>
                <Icon className={`h-4 w-4 ${accent || 'text-muted-foreground'}`} />
            </div>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
        </div>
    );
}

interface DashboardStatsProps {
    activeAutomations: number;
    totalExecutions: number;
    completed: number;
    errors: number;
    alerts: number;
}

export function DashboardStats({
    activeAutomations,
    totalExecutions,
    completed,
    errors,
    alerts,
}: DashboardStatsProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
                label="Total Automações"
                value={totalExecutions}
                icon={PlayCircle}
                accent="text-accent"
            />
            <StatCard
                label="Automações em Execução"
                value={activeAutomations}
                icon={Cpu}
                accent="text-primary"
            />

            <StatCard
                label="Concluídas"
                value={completed}
                icon={CheckCircle2}
                accent="text-success"
            />
            <StatCard
                label="Erros"
                value={errors}
                icon={AlertTriangle}
                accent="text-destructive"
            />
            <StatCard
                label="Alertas"
                value={alerts}
                icon={TriangleAlert}
                accent="text-warning"
            />
        </div>
    );
}
