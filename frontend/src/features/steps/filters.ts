import type { FilterField } from '@/shared/types/filters';

export const stepExecutionIdFilter: FilterField = {
    key: 'execution',
    label: 'Execução (ID)',
    type: 'text',
    placeholder: 'ID da execução',
};

export const stepIdentificationFilter: FilterField = {
    key: 'identification',
    label: 'Identificação',
    type: 'text',
    placeholder: 'Buscar por identificação',
};

export const stepStatusFilter: FilterField = {
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

export const stepDateStartFilter: FilterField = {
    key: 'date_start',
    label: 'Data Início',
    type: 'date',
};
