// ─── Types ───────────────────────────────────────────────────────────────
export type { Department, DepartmentCreate, DepartmentUpdate, DepartmentFilters, DepartmentOption } from './types';

// ─── API ──────────────────────────────────────────────────────────────────
export { departmentsApi } from './api';

// ─── Hooks ────────────────────────────────────────────────────────────────
export { useDepartments, useDepartment, useCreateDepartment, useUpdateDepartment, useDepartmentOptions, useDepartmentForm } from './hooks';
export type { DepartmentFormData, DepartmentEditData } from './hooks';

// ─── Filters ──────────────────────────────────────────────────────────────
export { departmentNameFilter, departmentDescriptionFilter } from './filters';
