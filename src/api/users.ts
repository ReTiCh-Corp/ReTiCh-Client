import { apiClient } from './client';
import type { PaginationMeta } from './conversations';
import { USER_ENDPOINTS } from './endpoints';

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface ListUsersParams {
  limit?: number;
  offset?: number;
  search?: string;
  sort?: string;
}

interface ApiResponse<T> {
  data: T;
  pagination?: PaginationMeta;
}

export function listUsers(params?: ListUsersParams) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));
  if (params?.search) searchParams.set('search', params.search);
  if (params?.sort) searchParams.set('sort', params.sort);

  const query = searchParams.toString();
  const endpoint = `${USER_ENDPOINTS.LIST}${query ? `?${query}` : ''}`;

  return apiClient<ApiResponse<User[]>>(endpoint);
}
