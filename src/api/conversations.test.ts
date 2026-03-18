import { apiClient } from './client';
import {
  createConversation,
  getConversation,
  listConversations,
} from './conversations';

vi.mock('./client', () => ({
  apiClient: vi.fn(),
}));

const mockedApiClient = vi.mocked(apiClient);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('listConversations', () => {
  it('calls the correct endpoint without params', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await listConversations();

    expect(mockedApiClient).toHaveBeenCalledWith('/conversations');
  });

  it('appends limit and offset as query params', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await listConversations({ limit: 10, offset: 20 });

    expect(mockedApiClient).toHaveBeenCalledWith(
      '/conversations?limit=10&offset=20',
    );
  });

  it('appends only limit when offset is not provided', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await listConversations({ limit: 5 });

    expect(mockedApiClient).toHaveBeenCalledWith('/conversations?limit=5');
  });

  it('returns the API response', async () => {
    const response = { data: [{ id: '1', name: 'Test' }] };
    mockedApiClient.mockResolvedValue(response);

    const result = await listConversations();

    expect(result).toEqual(response);
  });
});

describe('getConversation', () => {
  it('calls the correct endpoint with id', async () => {
    mockedApiClient.mockResolvedValue({ data: { id: 'abc' } });

    await getConversation('abc');

    expect(mockedApiClient).toHaveBeenCalledWith('/conversations/abc');
  });

  it('returns the API response', async () => {
    const response = { data: { id: 'abc', name: 'Test' } };
    mockedApiClient.mockResolvedValue(response);

    const result = await getConversation('abc');

    expect(result).toEqual(response);
  });
});

describe('createConversation', () => {
  it('calls the correct endpoint with POST and body', async () => {
    mockedApiClient.mockResolvedValue({ data: { id: 'new' } });

    await createConversation({ type: 'direct', name: 'New conv' });

    expect(mockedApiClient).toHaveBeenCalledWith('/conversations', {
      method: 'POST',
      body: { type: 'direct', name: 'New conv' },
    });
  });

  it('returns the API response', async () => {
    const response = { data: { id: 'new', type: 'direct', name: 'New conv' } };
    mockedApiClient.mockResolvedValue(response);

    const result = await createConversation({ type: 'direct' });

    expect(result).toEqual(response);
  });
});
