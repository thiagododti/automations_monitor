import type { FilterField } from '@/shared/types/filters';

export const executionStatusFilter: FilterField = {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
        { label: 'Iniciado', value: 'iniciado' },
        { label: 'Concluído', value: 'concluido' },
        { label: 'Erro', value: 'erro' },
        { label: 'Alerta', value: 'alerta' },
        { label: 'Teste', value: 'teste' },
    ],
};

export const executionDateStartFilter: FilterField = {
    key: 'date_start',
    label: 'Data Início',
    type: 'date',
};

export const executionAutomationFilter: FilterField = {
    key: 'automation',
    label: 'Automação',
    type: 'text',
    placeholder: 'Nome da automação',
};
