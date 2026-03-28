import React from 'react';
import { Bot, Loader2, User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { EfficiencyBadge } from '@/shared/components/EfficiencyBadge';
import type { Step } from '../types';
import { formatSeconds, formatCurrency } from '@/lib/formatters';

interface StepTableProps {
    data: {
        results: Step[];
        count: number;
    } | undefined;
    isLoading: boolean;
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

export function StepTable({ data, isLoading }: StepTableProps) {
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
                                <Tip content="Identificador único do step">ID</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground">
                                <Tip content="Número da execução a qual este step pertence e seu status">Execução</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground">
                                <Tip content="Identificação ou rótulo do step dentro da automação">Identificação</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground">
                                <Tip content="Data/hora de início (linha superior) e fim (linha inferior) do step">Período</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground text-right">
                                <Tip content={<span>🤖 Tempo que o robô levou para executar este step<br />👤 Tempo que um humano levaria para o mesmo step</span>}>🤖 Exec. / 👤 Manual</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground text-center">
                                <Tip content="Percentual de eficiência da automação neste step. Acima de 100% = robô mais ágil que o humano.">Eficiência</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground text-right">
                                <Tip content={<span><strong>Potencial:</strong> trabalho humano eliminado por este step<br /><strong>Real:</strong> tempo efetivamente economizado</span>}>T. Economizado</Tip>
                            </TableHead>
                            <TableHead className="text-muted-foreground text-right">
                                <Tip content="Custo do trabalho humano eliminado por este step (valor potencial)">Custo Potencial</Tip>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.results.map((step) => (
                            <TableRow key={step.id} className="border-border">

                                {/* ID */}
                                <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                                    <Tip content={`Step #${step.id}`}>{step.id}</Tip>
                                </TableCell>

                                {/* Execução + status da execução */}
                                <TableCell>
                                    <Tip content={
                                        <span>
                                            Execução #{step.execution}<br />
                                            Status: {step.execution_data.status}<br />
                                            Início: {new Date(step.execution_data.date_start).toLocaleString('pt-BR')}
                                        </span>
                                    }>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-mono text-xs tabular-nums text-muted-foreground">
                                                #{step.execution}
                                            </span>
                                            <StatusBadge status={step.execution_data.status as never} />
                                        </div>
                                    </Tip>
                                </TableCell>

                                {/* Identificação + Status do step */}
                                <TableCell>
                                    <Tip content={step.identification ? `Identificação: ${step.identification}` : 'Step sem identificação'}>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-foreground text-sm">
                                                {step.identification || '—'}
                                            </span>
                                            <StatusBadge status={step.status} />
                                        </div>
                                    </Tip>
                                </TableCell>

                                {/* Período */}
                                <TableCell>
                                    <Tip content={
                                        <span>
                                            Início: {new Date(step.date_start).toLocaleString('pt-BR')}<br />
                                            {step.date_end
                                                ? `Fim: ${new Date(step.date_end).toLocaleString('pt-BR')}`
                                                : 'Step ainda em andamento'}
                                        </span>
                                    }>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-mono text-xs tabular-nums text-muted-foreground">
                                                {new Date(step.date_start).toLocaleString('pt-BR')}
                                            </span>
                                            {step.date_end ? (
                                                <span className="font-mono text-xs tabular-nums text-muted-foreground/50">
                                                    {new Date(step.date_end).toLocaleString('pt-BR')}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground/40">—</span>
                                            )}
                                        </div>
                                    </Tip>
                                </TableCell>

                                {/* Tempo robô vs humano */}
                                <TableCell className="text-right">
                                    <Tip content={
                                        <span>
                                            🤖 Tempo da automação: {formatSeconds(step.time_automation_seconds)}<br />
                                            👤 Tempo manual equivalente: {formatSeconds(step.time_manual_seconds)}
                                        </span>
                                    }>
                                        <div className="flex flex-col gap-0.5 items-end">
                                            <span className="inline-flex items-center gap-1 font-mono text-xs tabular-nums text-muted-foreground">
                                                <Bot className="h-3 w-3 shrink-0" />
                                                {formatSeconds(step.time_automation_seconds)}
                                            </span>
                                            <span className="inline-flex items-center gap-1 font-mono text-xs tabular-nums text-muted-foreground/50">
                                                <User className="h-3 w-3 shrink-0" />
                                                {formatSeconds(step.time_manual_seconds)}
                                            </span>
                                        </div>
                                    </Tip>
                                </TableCell>

                                {/* Eficiência */}
                                <TableCell className="text-center">
                                    <Tip content={
                                        <span>
                                            Eficiência de {parseFloat(step.efficiency_percent).toFixed(1)}%.<br />
                                            {parseFloat(step.efficiency_percent) >= 100
                                                ? 'O robô é mais ágil que o humano.'
                                                : 'O humano ainda é mais rápido neste step.'}
                                        </span>
                                    }>
                                        <EfficiencyBadge value={step.efficiency_percent} />
                                    </Tip>
                                </TableCell>

                                {/* Tempo economizado potencial + real */}
                                <TableCell className="text-right">
                                    <Tip content={
                                        <span>
                                            <strong>Potencial:</strong> {formatSeconds(step.potential_time_seconds)} de trabalho humano eliminado<br />
                                            <strong>Real:</strong> {formatSeconds(step.time_economy_seconds)} economizados neste step
                                        </span>
                                    }>
                                        <div className="flex flex-col gap-0.5 items-end">
                                            <span className="font-mono text-xs tabular-nums text-green-500">
                                                {formatSeconds(step.potential_time_seconds)}
                                            </span>
                                            <span className="font-mono text-xs tabular-nums text-muted-foreground/50">
                                                real {formatSeconds(step.time_economy_seconds)}
                                            </span>
                                        </div>
                                    </Tip>
                                </TableCell>

                                {/* Custo potencial (step não tem cost_economy) */}
                                <TableCell className="text-right">
                                    <Tip content={`Custo do trabalho humano eliminado por este step: ${formatCurrency(step.potential_cost)}`}>
                                        <span className="font-mono text-xs tabular-nums text-green-500">
                                            {formatCurrency(step.potential_cost)}
                                        </span>
                                    </Tip>
                                </TableCell>

                            </TableRow>
                        ))}
                        {data?.results.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                    Nenhum step encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </TooltipProvider>
    );
}
