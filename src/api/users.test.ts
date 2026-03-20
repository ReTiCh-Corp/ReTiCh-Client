import { apiClient } from './client';
import { listUsers } from './users';

vi.mock('./client', () => ({
  apiClient: vi.fn(),
}));

const mockedApiClient = vi.mocked(apiClient);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('listUsers', () => {
  it('calls the correct endpoint without params', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await listUsers();

    expect(mockedApiClient).toHaveBeenCalledWith('/api/v1/user/users');
  });

  it('appends limit and offset as query params', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await listUsers({ limit: 10, offset: 20 });

    expect(mockedApiClient).toHaveBeenCalledWith('/api/v1/user/users?limit=10&offset=20');
  });

  it('appends only limit when offset is not provided', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await listUsers({ limit: 5 });

    expect(mockedApiClient).toHaveBeenCalledWith('/api/v1/user/users?limit=5');
  });

  it('appends search as query param', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await listUsers({ search: 'alice' });

    expect(mockedApiClient).toHaveBeenCalledWith('/api/v1/user/users?search=alice');
  });

  it('appends sort as query param', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await listUsers({ sort: 'new' });

    expect(mockedApiClient).toHaveBeenCalledWith('/api/v1/user/users?sort=new');
  });

  it('appends all params together', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await listUsers({ limit: 10, offset: 0, search: 'bob', sort: 'new' });

    expect(mockedApiClient).toHaveBeenCalledWith(
      '/api/v1/user/users?limit=10&search=bob&sort=new',
    );
  });

  it('does not append search when empty string', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await listUsers({ search: '' });

    expect(mockedApiClient).toHaveBeenCalledWith('/api/v1/user/users');
  });

  it('does not append sort when empty string', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await listUsers({ sort: '' });

    expect(mockedApiClient).toHaveBeenCalledWith('/api/v1/user/users');
  });

  it('returns the API response', async () => {
    const response = {
      data: [{ id: '1', email: 'a@b.com', username: 'alice' }],
    };
    mockedApiClient.mockResolvedValue(response);

    const result = await listUsers();

    expect(result).toEqual(response);
  });
});
