import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import type { Evolution } from '../types';
import { type GroupBy, toNumber, formatPeriod } from '@/lib/formatters';

const chartConfig = {
    executions: { label: 'Execuções', color: 'hsl(var(--primary))' },
    efficiency: { label: 'Eficiência (%)', color: 'hsl(var(--success))' },
    costEconomy: { label: 'Economia (R$)', color: 'hsl(var(--warning))' },
} satisfies ChartConfig;

interface EvolutionChartProps {
    data: Evolution[];
    groupBy: GroupBy;
    isLoading: boolean;
}

export function EvolutionChart({ data, groupBy, isLoading }: EvolutionChartProps) {
    const chartData = useMemo(
        () =>
            data.map((item) => ({
                periodLabel: formatPeriod(item.period, groupBy),
                executions: item.total_executions,
                efficiency: toNumber(item.avg_efficiency_percent),
                costEconomy: toNumber(item.total_cost_economy),
            })),
        [data, groupBy],
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Evolução Temporal</CardTitle>
                <CardDescription>
                    Tendência de execuções, eficiência e economia no período selecionado ({groupBy})
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
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
    );
}
