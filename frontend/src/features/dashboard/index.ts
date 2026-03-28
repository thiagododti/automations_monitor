// ─── Types ───────────────────────────────────────────────────────────────
export type { Evolution, EvolutionFilters, Kpis, KpisByAutomations, KpiFilters, KpisByAutomationFilters } from './types';

// ─── API ──────────────────────────────────────────────────────────────────
export { dashboardApi } from './api';

// ─── Hooks ────────────────────────────────────────────────────────────────
export { useEvolution, useKpis, useKpisByAutomation } from './hooks';

// ─── Filters ──────────────────────────────────────────────────────────────
export { dashboardStatusFilter, dashboardDateFromFilter, dashboardDateToFilter } from './filters';
