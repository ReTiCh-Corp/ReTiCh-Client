import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { USER_ENDPOINTS } from '../api/endpoints';
import type { User, UpdateProfileInput } from '../api/users';

export function useMyProfile() {
  return useQuery<User>({
    queryKey: ['profile', 'me'],
    queryFn: () => apiClient<User>(USER_ENDPOINTS.ME),
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      apiClient<User>(USER_ENDPOINTS.ME, {
        method: 'PUT',
        body: input,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}
