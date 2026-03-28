// ─── Types ───────────────────────────────────────────────────────────────
export type { Automation, AutomationCreate, AutomationUpdate, AutomationFilters, AutomationsStatus, AutomationDetails } from './types';

// ─── API ──────────────────────────────────────────────────────────────────
export { automationsApi } from './api';

// ─── Hooks ────────────────────────────────────────────────────────────────
export { useAutomations, useAutomation, useCreateAutomation, useUpdateAutomation, useAutomationStatus, useAutomationForm } from './hooks';
export type { AutomationFormData, AutomationEditData } from './hooks';

// ─── Filters ──────────────────────────────────────────────────────────────
export { automationNameFilter, automationIsActiveFilter } from './filters';
