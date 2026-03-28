import type { ExecutionStatus } from '@/features/executions/types';
import type { StepStatus } from '@/features/steps/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; className: string }> = {
  iniciado: { label: 'Iniciado', className: 'bg-primary/15 text-primary' },
  concluido: { label: 'Concluído', className: 'bg-success/15 text-success' },
  erro: { label: 'Erro', className: 'bg-destructive/15 text-destructive' },
  alerta: { label: 'Alerta', className: 'bg-warning/15 text-warning' },
  teste: { label: 'Teste', className: 'bg-accent/15 text-accent' },
};

export function StatusBadge({ status }: { status: ExecutionStatus | StepStatus | string }) {
  const config = statusConfig[status] || { label: status, className: 'bg-muted text-muted-foreground' };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
