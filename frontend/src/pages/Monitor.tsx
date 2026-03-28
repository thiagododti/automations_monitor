import { useAutomationStatus } from '@/features/automations/hooks';
import { Loader2 } from 'lucide-react';
import { DashboardStats } from '@/features/dashboard/components/DashboardStats';
import { AutomationStatusMonitor } from '@/features/monitor/components/AutomationStatusMonitor';

export default function MonitorPage() {
  const {
    data: statusData,
    isLoading: loadingStatus,
    isFetching: fetchingStatus,
  } = useAutomationStatus(10000);

  const isLoading = loadingStatus;
  const automationsStatus = statusData || [];

  const activeAutomations = automationsStatus.filter((a) => a.last_status === 'iniciado').length;
  const totalExecutions = automationsStatus.length;
  const errors = automationsStatus.filter((a) => a.last_status === 'erro').length;
  const completed = automationsStatus.filter((a) => a.last_status === 'concluido').length;
  const alerts = automationsStatus.filter((a) => a.last_status === 'alerta').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do sistema</p>
      </div>

      <DashboardStats
        activeAutomations={activeAutomations}
        totalExecutions={totalExecutions}
        completed={completed}
        errors={errors}
        alerts={alerts}
      />

      <AutomationStatusMonitor statuses={automationsStatus} isRefreshing={fetchingStatus} />
    </div>
  );
}
