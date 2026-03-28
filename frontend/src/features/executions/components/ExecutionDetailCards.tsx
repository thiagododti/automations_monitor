// ─── DetailItem ──────────────────────────────────────────────────────────────

interface DetailItemProps {
    label: string;
    value: string;
    mono?: boolean;
}

export function DetailItem({ label, value, mono = false }: DetailItemProps) {
    return (
        <div className="rounded-md border border-border/70 bg-secondary/30 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className={`mt-1 text-sm text-foreground ${mono ? 'font-mono tabular-nums' : ''}`}>{value}</p>
        </div>
    );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

interface MetricCardProps {
    label: string;
    value: string;
    sub?: string;
}

export function MetricCard({ label, value, sub }: MetricCardProps) {
    return (
        <div className="rounded-lg border border-border bg-card p-4 shadow-surface-sm">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-1 text-lg font-semibold text-foreground font-mono tabular-nums">{value}</p>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground/70 font-mono tabular-nums">{sub}</p>}
        </div>
    );
}

// ─── EfficiencyCard ───────────────────────────────────────────────────────────

interface EfficiencyCardProps {
    value: string;
}

export function EfficiencyCard({ value }: EfficiencyCardProps) {
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
                {num >= 100
                    ? 'Robô mais ágil que o humano'
                    : num >= 50
                        ? 'Performance moderada'
                        : 'Humano ainda mais rápido'}
            </p>
        </div>
    );
}
