import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';

interface StatCardProps {
    title: string;
    value: string;
    description: string;
    icon: React.ElementType;
}

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                    <CardDescription>{title}</CardDescription>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold tabular-nums text-foreground">{value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
