import type { FilterField } from '@/shared/types/filters';

export const userFullNameFilter: FilterField = {
    key: 'full_name',
    label: 'Nome Completo',
    type: 'text',
    placeholder: 'Buscar por nome completo',
};

export const userEmailFilter: FilterField = {
    key: 'email',
    label: 'Email',
    type: 'text',
    placeholder: 'Buscar por email',
};

export const userUsernameFilter: FilterField = {
    key: 'username',
    label: 'Usuário',
    type: 'text',
    placeholder: 'Buscar por usuário',
};
