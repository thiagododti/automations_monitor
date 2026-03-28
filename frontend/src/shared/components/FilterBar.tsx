import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import type { FilterField } from '@/shared/types/filters';

export type { FilterField };

interface FilterBarProps {
  fields: FilterField[];
  onFilter: (values: Record<string, string>) => void;
  onClear: () => void;
}

export function FilterBar({ fields, onFilter, onClear }: FilterBarProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilter = () => {
    const cleaned: Record<string, string> = {};
    Object.entries(values).forEach(([k, v]) => {
      if (v && v.trim() !== '') cleaned[k] = v;
    });
    onFilter(cleaned);
  };

  const handleClear = () => {
    setValues({});
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleFilter();
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-surface-sm">
      <div className="flex flex-wrap items-end gap-3">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5 min-w-[160px] flex-1 max-w-[240px]">
            <Label className="text-xs text-muted-foreground">{field.label}</Label>
            {field.type === 'select' ? (
              <Select
                value={values[field.key] || ''}
                onValueChange={(v) => handleChange(field.key, v === '__all__' ? '' : v)}
              >
                <SelectTrigger className="bg-secondary border-border h-9 text-sm">
                  <SelectValue placeholder={field.placeholder || 'Todos'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todos</SelectItem>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={field.type}
                value={values[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={field.placeholder || ''}
                className="bg-secondary border-border h-9 text-sm"
              />
            )}
          </div>
        ))}
        <div className="flex items-center gap-2 pb-0.5">
          <Button size="sm" onClick={handleFilter} className="h-9">
            <Search className="mr-1.5 h-3.5 w-3.5" />
            Filtrar
          </Button>
          <Button size="sm" variant="outline" onClick={handleClear} className="h-9">
            <X className="mr-1.5 h-3.5 w-3.5" />
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
}
