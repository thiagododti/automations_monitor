import type { FilterField } from '@/shared/types/filters';

export const positionNameFilter: FilterField = {
    key: 'name',
    label: 'Nome',
    type: 'text',
    placeholder: 'Buscar por nome',
};

export const positionDescriptionFilter: FilterField = {
    key: 'description',
    label: 'Descrição',
    type: 'text',
    placeholder: 'Buscar na descrição',
};
