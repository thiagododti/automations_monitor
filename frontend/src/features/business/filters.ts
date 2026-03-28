import type { FilterField } from '@/shared/types/filters';

export const businessNameFilter: FilterField = {
    key: 'name',
    label: 'Nome',
    type: 'text',
    placeholder: 'Buscar por nome',
};

export const businessCnpjFilter: FilterField = {
    key: 'cnpj',
    label: 'CNPJ',
    type: 'text',
    placeholder: 'Buscar por CNPJ',
};

export const businessDescriptionFilter: FilterField = {
    key: 'description',
    label: 'Descrição',
    type: 'text',
    placeholder: 'Buscar na descrição',
};
