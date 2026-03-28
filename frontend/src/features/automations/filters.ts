import type { FilterField } from '@/shared/types/filters';

export const automationNameFilter: FilterField = {
    key: 'name',
    label: 'Nome',
    type: 'text',
    placeholder: 'Buscar por nome',
};

export const automationIsActiveFilter: FilterField = {
    key: 'is_active',
    label: 'Status',
    type: 'select',
    options: [
        { label: 'Ativo', value: 'true' },
        { label: 'Inativo', value: 'false' },
    ],
};
