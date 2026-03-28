import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '@/shared/layout/AppLayout';

const Login = lazy(() => import('@/pages/Login'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));
const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const MonitorPage = lazy(() => import('@/pages/Monitor'));
const UsersPage = lazy(() => import('@/pages/Users'));
const DepartmentsPage = lazy(() => import('@/pages/Departments'));
const BusinessesPage = lazy(() => import('@/pages/Businesses'));
const AutomationsPage = lazy(() => import('@/pages/Automations'));
const ExecutionsPage = lazy(() => import('@/pages/Executions'));
const ExecutionDetailPage = lazy(() => import('@/pages/ExecutionDetail'));
const LogsPage = lazy(() => import('@/pages/Logs'));
const StepsPage = lazy(() => import('@/pages/Steps'));
const PositionsPage = lazy(() => import('@/pages/Positions'));

const FullPageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export function AppRoutes() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/monitoramento" element={<MonitorPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/businesses" element={<BusinessesPage />} />
            <Route path="/automations" element={<AutomationsPage />} />
            <Route path="/executions" element={<ExecutionsPage />} />
            <Route path="/executions/:id" element={<ExecutionDetailPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/steps" element={<StepsPage />} />
            <Route path="/positions" element={<PositionsPage />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
