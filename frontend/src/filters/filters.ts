import { FilterField } from "@/components/shared/FilterBar";

export const StatusFilters: FilterField = {
    key: 'status', label: 'Status', type: 'select', options: [
        { label: 'Iniciado', value: 'iniciado' },
        { label: 'Concluído', value: 'concluido' },
        { label: 'Erro', value: 'erro' },
        { label: 'Alerta', value: 'alerta' },
        { label: 'Teste', value: 'teste' },
    ]
}

export const DateStartFilter: FilterField = { key: 'date_start', label: 'Data Início', type: 'date' }

export const AutomationNameFilter: FilterField = { key: 'automation', label: 'Automação', type: 'text', placeholder: 'Nome da automação' }

export const ExecutionIdFilter: FilterField = { key: 'execution', label: 'Execução (ID)', type: 'text', placeholder: 'ID da execução' }

export const StepIdentificationFilter: FilterField = { key: 'identification', label: 'Identificação', type: 'text', placeholder: 'Buscar por identificação' }

export const CreatedAtFilter: FilterField = { key: 'created_at', label: 'Data Criação', type: 'date' }

export const DescriptionFilter: FilterField = { key: 'description', label: 'Descrição', type: 'text', placeholder: 'Buscar na descrição' }

export const NameFilter: FilterField = { key: 'name', label: 'Nome', type: 'text', placeholder: 'Buscar por nome' }

export const CNPJFilter: FilterField = { key: 'cnpj', label: 'CNPJ', type: 'text', placeholder: 'Buscar por CNPJ' }

export const UsernameFilter: FilterField = { key: 'username', label: 'Usuário', type: 'text', placeholder: 'Buscar por usuário' }

export const EmailFilter: FilterField = { key: 'email', label: 'Email', type: 'text', placeholder: 'Buscar por email' }

export const FullNameFilter: FilterField = { key: 'full_name', label: 'Nome Completo', type: 'text', placeholder: 'Buscar por nome completo' }

export const IsActiveFilter: FilterField = { key: 'is_active', label: 'Status', type: 'select', options: [{ label: 'Ativo', value: 'true' }, { label: 'Inativo', value: 'false' }] }

export const DateFromFilter: FilterField = { key: 'date_from', label: 'Data De', type: 'date' }

export const DateToFilter: FilterField = { key: 'date_to', label: 'Data Até', type: 'date' }