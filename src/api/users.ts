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

export function checkUsernameAvailability(username: string) {
  const endpoint = `${USER_ENDPOINTS.CHECK_USERNAME}?username=${encodeURIComponent(username)}`;
  return apiClient<{ available: boolean }>(endpoint);
}

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  status: string;
  custom_status: string | null;
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  phone: string | null;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileInput {
  username: string;
  status: string;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  custom_status?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  gender?: string | null;
  phone?: string | null;
}

export function getMyProfile() {
  return apiClient<Profile>(USER_ENDPOINTS.ME);
}

export function updateMyProfile(input: UpdateProfileInput) {
  return apiClient<Profile>(USER_ENDPOINTS.ME, {
    method: 'PUT',
    body: input,
  });
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
