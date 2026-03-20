import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { automationsApi } from '@/api/automations';
import type { AutomationFilters, AutomationCreate, AutomationUpdate } from '@/types/automation';

export function useAutomations(filters?: AutomationFilters, page = 1) {
  return useQuery({
    queryKey: ['automations', filters, page],
    queryFn: () => automationsApi.list({ ...filters, page }).then((res) => res.data),
  });
}

export function useAutomation(id: number) {
  return useQuery({
    queryKey: ['automations', id],
    queryFn: () => automationsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateAutomation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AutomationCreate) => automationsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['automations'] }),
  });
}

export function useUpdateAutomation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AutomationUpdate }) => automationsApi.patch(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['automations'] }),
  });
}

export function useAutomationStatus(refetchInterval = 0) {
  return useQuery({
    queryKey: ['automations', 'status'],
    queryFn: () => automationsApi.getStatus().then((res) => res.data),
    refetchInterval,
    refetchIntervalInBackground: refetchInterval > 0,
  });
}