import { apiClient } from './client';
import {
  addParticipants,
  archiveConversation,
  createConversation,
  getConversation,
  listConversations,
  removeParticipant,
  updateConversation,
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

  it('appends search as query param', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await listConversations({ search: 'hello' });

    expect(mockedApiClient).toHaveBeenCalledWith('/conversations?search=hello');
  });

  it('appends search alongside limit and offset', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await listConversations({ limit: 10, offset: 0, search: 'test' });

    expect(mockedApiClient).toHaveBeenCalledWith(
      '/conversations?limit=10&search=test',
    );
  });

  it('does not append search when empty string', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await listConversations({ search: '' });

    expect(mockedApiClient).toHaveBeenCalledWith('/conversations');
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

describe('updateConversation', () => {
  it('calls the correct endpoint with PUT and body', async () => {
    mockedApiClient.mockResolvedValue({ data: { id: '1' } });

    await updateConversation('1', { name: 'Updated' });

    expect(mockedApiClient).toHaveBeenCalledWith('/conversations/1', {
      method: 'PUT',
      body: { name: 'Updated' },
    });
  });
});

describe('archiveConversation', () => {
  it('calls the correct endpoint with DELETE', async () => {
    mockedApiClient.mockResolvedValue(undefined);

    await archiveConversation('1');

    expect(mockedApiClient).toHaveBeenCalledWith('/conversations/1', {
      method: 'DELETE',
    });
  });
});

describe('addParticipants', () => {
  it('calls the correct endpoint with POST and participant_ids', async () => {
    mockedApiClient.mockResolvedValue({ data: [] });

    await addParticipants('conv1', ['u1', 'u2']);

    expect(mockedApiClient).toHaveBeenCalledWith(
      '/conversations/conv1/participants',
      {
        method: 'POST',
        body: { participant_ids: ['u1', 'u2'] },
      },
    );
  });
});

describe('removeParticipant', () => {
  it('calls the correct endpoint with DELETE', async () => {
    mockedApiClient.mockResolvedValue(undefined);

    await removeParticipant('conv1', 'u1');

    expect(mockedApiClient).toHaveBeenCalledWith(
      '/conversations/conv1/participants/u1',
      {
        method: 'DELETE',
      },
    );
  });
});
