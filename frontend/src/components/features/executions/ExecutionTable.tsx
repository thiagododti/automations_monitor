import { Bot, Loader2, User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Execution } from '@/types/execution';

interface ExecutionTableProps {
    data: {
        results: Execution[];
        count: number;
    } | undefined;
    isLoading: boolean;
}

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

function EfficiencyBadge({ value }: { value: string }) {
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

function Tip({ children, content }: { children: React.ReactNode; content: React.ReactNode }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="inline-flex w-full cursor-default">{children}</span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-center leading-relaxed">{content}</TooltipContent>
        </Tooltip>
    );
}

export function ExecutionTable({ data, isLoading }: ExecutionTableProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <TooltipProvider delayDuration={300}>
            <div className="rounded-lg border border-border bg-card shadow-surface-sm overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground w-12">
                                <Tip content="Identificador único da execução">ID</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground">
                                <Tip content="Nome da automação e seu status atual">Automação</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground">
                                <Tip content="Empresa vinculada a esta execução">Empresa</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground">
                                <Tip content="Data/hora de início (linha superior) e fim (linha inferior) da execução">Período</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground text-right">
                                <Tip content="Steps concluídos com sucesso ✓, com erro ✗ e total executados">Steps</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground text-right">
                                <Tip content={<span>🤖 Tempo que o robô levou para executar<br />👤 Tempo que um humano levaria para o mesmo processo</span>}>🤖 Exec. / 👤 Manual</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground text-center">
                                <Tip content="Percentual de eficiência da automação. Acima de 100% = robô mais ágil que o humano.">Eficiência</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground text-right">
                                <Tip content={<span><strong>Potencial:</strong> total de trabalho humano eliminado pela automação<br /><strong>Real:</strong> tempo efetivamente economizado nesta execução</span>}>T. Economizado</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground text-right">
                                <Tip content={<span><strong>Potencial:</strong> custo do trabalho humano eliminado<br /><strong>Real:</strong> custo efetivamente economizado nesta execução</span>}>Custo Economizado</Tip>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.results.map((exec) => (
                            <TableRow key={exec.id} className="border-border">

                                {/* ID */}
                                <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                                    <Tip content={`Execução #${exec.id}`}>{exec.id}</Tip>
                                </TableCell>

                                {/* Automação + Status */}
                                <TableCell>
                                    <Tip content={exec.automation_data.description ?? exec.automation_data.name}>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-foreground font-medium leading-snug">
                                                {exec.automation_data.name}
                                            </span>
                                            <StatusBadge status={exec.status} />
                                        </div>
                                    </Tip>
                                </TableCell>

                                {/* Empresa */}
                                <TableCell>
                                    <Tip content={exec.business_data?.cnpj ?? 'CNPJ nao informado'}>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-foreground font-medium leading-snug">
                                                {exec.business_data?.name || 'Empresa nao informada'}
                                            </span>
                                            {exec.business_data?.cnpj ? (
                                                <span className="font-mono text-xs tabular-nums text-muted-foreground/70">
                                                    {exec.business_data.cnpj}
                                                </span>
                                            ) : null}
                                        </div>
                                    </Tip>
                                </TableCell>

                                {/* Período */}
                                <TableCell>
                                    <Tip content={
                                        <span>
                                            Início: {new Date(exec.date_start).toLocaleString('pt-BR')}<br />
                                            {exec.date_end
                                                ? `Fim: ${new Date(exec.date_end).toLocaleString('pt-BR')}`
                                                : 'Execução ainda em andamento'}
                                        </span>
                                    }>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-mono text-xs tabular-nums text-muted-foreground">
                                                {new Date(exec.date_start).toLocaleString('pt-BR')}
                                            </span>
                                            {exec.date_end ? (
                                                <span className="font-mono text-xs tabular-nums text-muted-foreground/50">
                                                    {new Date(exec.date_end).toLocaleString('pt-BR')}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground/40">—</span>
                                            )}
                                        </div>
                                    </Tip>
                                </TableCell>

                                {/* Steps */}
                                <TableCell className="text-right">
                                    <Tip content={`${exec.success_count} step(s) com sucesso · ${exec.error_count} com erro · ${exec.step_counts} no total`}>
                                        <span className="font-mono text-xs tabular-nums">
                                            <span className="text-green-500">{exec.success_count} ✓</span>
                                            <span className="text-muted-foreground mx-1">·</span>
                                            <span className="text-destructive">{exec.error_count} ✗</span>
                                            <span className="text-muted-foreground mx-1">·</span>
                                            <span className="text-muted-foreground">{exec.step_counts}</span>
                                        </span>
                                    </Tip>
                                </TableCell>

                                {/* Tempo robô vs humano */}
                                <TableCell className="text-right">
                                    <Tip content={
                                        <span>
                                            🤖 Tempo da automação: {formatSeconds(exec.time_automation_seconds)}<br />
                                            👤 Tempo manual equivalente: {formatSeconds(exec.time_manual_seconds)}
                                        </span>
                                    }>
                                        <div className="flex flex-col gap-0.5 items-end">
                                            <span className="inline-flex items-center gap-1 font-mono text-xs tabular-nums text-muted-foreground">
                                                <Bot className="h-3 w-3 shrink-0" />
                                                {formatSeconds(exec.time_automation_seconds)}
                                            </span>
                                            <span className="inline-flex items-center gap-1 font-mono text-xs tabular-nums text-muted-foreground/50">
                                                <User className="h-3 w-3 shrink-0" />
                                                {formatSeconds(exec.time_manual_seconds)}
                                            </span>
                                        </div>
                                    </Tip>
                                </TableCell>

                                {/* Eficiência */}
                                <TableCell className="text-center">
                                    <Tip content={
                                        <span>
                                            Eficiência de {parseFloat(exec.efficiency_percent).toFixed(1)}%.<br />
                                            {parseFloat(exec.efficiency_percent) >= 100
                                                ? 'O robô é mais ágil que o humano.'
                                                : 'O humano ainda é mais rápido neste processo.'}
                                        </span>
                                    }>
                                        <EfficiencyBadge value={exec.efficiency_percent} />
                                    </Tip>
                                </TableCell>

                                {/* Tempo economizado potencial + real */}
                                <TableCell className="text-right">
                                    <Tip content={
                                        <span>
                                            <strong>Potencial:</strong> {formatSeconds(exec.potential_time_seconds)} de trabalho humano eliminado<br />
                                            <strong>Real:</strong> {formatSeconds(exec.time_economy_seconds)} economizados nesta execução
                                        </span>
                                    }>
                                        <div className="flex flex-col gap-0.5 items-end">
                                            <span className="font-mono text-xs tabular-nums text-green-500">
                                                {formatSeconds(exec.potential_time_seconds)}
                                            </span>
                                            <span className="font-mono text-xs tabular-nums text-muted-foreground/50">
                                                real {formatSeconds(exec.time_economy_seconds)}
                                            </span>
                                        </div>
                                    </Tip>
                                </TableCell>

                                {/* Custo economizado potencial + real */}
                                <TableCell className="text-right">
                                    <Tip content={
                                        <span>
                                            <strong>Potencial:</strong> {formatCurrency(exec.potential_cost)} de custo humano eliminado<br />
                                            <strong>Real:</strong> {formatCurrency(exec.cost_economy)} economizados nesta execução
                                        </span>
                                    }>
                                        <div className="flex flex-col gap-0.5 items-end">
                                            <span className="font-mono text-xs tabular-nums text-green-500">
                                                {formatCurrency(exec.potential_cost)}
                                            </span>
                                            <span className="font-mono text-xs tabular-nums text-muted-foreground/50">
                                                real {formatCurrency(exec.cost_economy)}
                                            </span>
                                        </div>
                                    </Tip>
                                </TableCell>

                            </TableRow>
                        ))}
                        {data?.results.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                    Nenhuma execução encontrada.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </TooltipProvider>
    );
}
