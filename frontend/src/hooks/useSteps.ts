import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stepsApi } from '@/api/steps';
import type { StepFilters, StepCreate } from '@/types/step';

export function useSteps(filters?: StepFilters, page = 1) {
  return useQuery({
    queryKey: ['steps', filters, page],
    queryFn: () => stepsApi.list({ ...filters, page }).then((res) => res.data),
  });
}

export function useStep(id: number) {
  return useQuery({
    queryKey: ['steps', id],
    queryFn: () => stepsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: StepCreate) => stepsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['steps'] }),
  });
}
