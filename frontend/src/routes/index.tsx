import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import Login from '@/pages/Login';
import DashboardKpiPage from '@/pages/DashboardKpi';
import UsersPage from '@/pages/Users';
import DepartmentsPage from '@/pages/Departments';
import BusinessesPage from '@/pages/Businesses';
import AutomationsPage from '@/pages/Automations';
import ExecutionsPage from '@/pages/Executions';
import LogsPage from '@/pages/Logs';
import StepsPage from '@/pages/Steps';
import PositionsPage from '@/pages/Positions';
import Dashboard from '@/pages/Dashboard';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardKpiPage />} />
          <Route path="/monitoramento" element={<Dashboard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/businesses" element={<BusinessesPage />} />
          <Route path="/automations" element={<AutomationsPage />} />
          <Route path="/executions" element={<ExecutionsPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/steps" element={<StepsPage />} />
          <Route path="/positions" element={<PositionsPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
