export interface FilterField {
    key: string;
    label: string;
    type: 'text' | 'select' | 'date';
    options?: { label: string; value: string }[];
    placeholder?: string;
}
