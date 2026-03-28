interface EfficiencyBadgeProps {
    value: string;
}

export function EfficiencyBadge({ value }: EfficiencyBadgeProps) {
    const num = parseFloat(value);
    const colorClass =
        num >= 100
            ? 'text-green-500 bg-green-500/10'
            : num >= 50
                ? 'text-yellow-500 bg-yellow-500/10'
                : 'text-destructive bg-destructive/10';
    return (
        <span className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-xs tabular-nums font-semibold ${colorClass}`}>
            {isNaN(num) ? value : `${num.toFixed(1)}%`}
        </span>
    );
}
