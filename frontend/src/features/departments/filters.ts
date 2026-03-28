import type { FilterField } from '@/shared/types/filters';

export const departmentNameFilter: FilterField = {
    key: 'name',
    label: 'Nome',
    type: 'text',
    placeholder: 'Buscar por nome',
};

export const departmentDescriptionFilter: FilterField = {
    key: 'description',
    label: 'Descrição',
    type: 'text',
    placeholder: 'Buscar na descrição',
};
