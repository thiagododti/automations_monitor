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
