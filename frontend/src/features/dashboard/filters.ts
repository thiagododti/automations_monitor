import type { FilterField } from '@/shared/types/filters';

export const dashboardStatusFilter: FilterField = {
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

export const dashboardDateFromFilter: FilterField = {
    key: 'date_from',
    label: 'Data De',
    type: 'date',
};

export const dashboardDateToFilter: FilterField = {
    key: 'date_to',
    label: 'Data Até',
    type: 'date',
};
