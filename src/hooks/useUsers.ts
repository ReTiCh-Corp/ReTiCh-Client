import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { type ListUsersParams, listUsers } from '../api/users';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: ListUsersParams) => [...userKeys.lists(), params] as const,
};

export function useUsers(params?: ListUsersParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => listUsers(params),
    placeholderData: keepPreviousData,
  });
}
