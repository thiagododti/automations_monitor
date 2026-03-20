import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import type { UserFilters, UserCreate, UserUpdate } from '@/types/user';

export function useUsers(filters?: UserFilters, page = 1) {
  return useQuery({
    queryKey: ['users', filters, page],
    queryFn: () => usersApi.list({ ...filters, page }).then((res) => res.data),
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UserCreate) => usersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdate }) => usersApi.patch(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
