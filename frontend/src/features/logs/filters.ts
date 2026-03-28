import type { FilterField } from '@/shared/types/filters';

export const logExecutionIdFilter: FilterField = {
    key: 'execution',
    label: 'Execução (ID)',
    type: 'text',
    placeholder: 'ID da execução',
};

export const logDescriptionFilter: FilterField = {
    key: 'description',
    label: 'Descrição',
    type: 'text',
    placeholder: 'Buscar na descrição',
};

export const logCreatedAtFilter: FilterField = {
    key: 'created_at',
    label: 'Data Criação',
    type: 'date',
};
