import { useConversationStore } from './useConversationStore';

const mockParticipant = (userId: string) => ({
  id: `p-${userId}`,
  conversation_id: '1',
  user_id: userId,
  role: 'member',
  nickname: null,
  joined_at: '2026-03-16T10:00:00Z',
});

const mockConversation = {
  id: '1',
  name: 'General',
  participants: [mockParticipant('user1'), mockParticipant('user2')],
  lastMessageAt: '2026-03-16T10:00:00Z',
};

const mockConversation2 = {
  id: '2',
  name: 'Random',
  participants: [mockParticipant('user1'), mockParticipant('user3')],
  lastMessageAt: '2026-03-16T11:00:00Z',
};

beforeEach(() => {
  useConversationStore.setState({
    conversations: [],
    currentConversationId: null,
    searchTerm: '',
    searchResults: [],
  });
});

describe('useConversationStore', () => {
  it('has correct initial state', () => {
    const state = useConversationStore.getState();
    expect(state.conversations).toEqual([]);
    expect(state.currentConversationId).toBeNull();
  });

  it('setConversations replaces all conversations', () => {
    const conversations = [mockConversation, mockConversation2];
    useConversationStore.getState().setConversations(conversations);
    expect(useConversationStore.getState().conversations).toEqual(
      conversations,
    );
  });

  it('setCurrentConversation updates the current conversation id', () => {
    useConversationStore.getState().setCurrentConversation('1');
    expect(useConversationStore.getState().currentConversationId).toBe('1');
  });

  it('setCurrentConversation can be set to null', () => {
    useConversationStore.getState().setCurrentConversation('1');
    useConversationStore.getState().setCurrentConversation(null);
    expect(useConversationStore.getState().currentConversationId).toBeNull();
  });

  it('addConversation appends a conversation', () => {
    useConversationStore.getState().addConversation(mockConversation);
    useConversationStore.getState().addConversation(mockConversation2);
    expect(useConversationStore.getState().conversations).toEqual([
      mockConversation,
      mockConversation2,
    ]);
  });

  it('removeConversation removes by id', () => {
    useConversationStore
      .getState()
      .setConversations([mockConversation, mockConversation2]);
    useConversationStore.getState().removeConversation('1');
    expect(useConversationStore.getState().conversations).toEqual([
      mockConversation2,
    ]);
  });

  it('removeConversation does nothing if id not found', () => {
    useConversationStore.getState().setConversations([mockConversation]);
    useConversationStore.getState().removeConversation('999');
    expect(useConversationStore.getState().conversations).toEqual([
      mockConversation,
    ]);
  });

  it('has empty searchTerm and searchResults initially', () => {
    const state = useConversationStore.getState();
    expect(state.searchTerm).toBe('');
    expect(state.searchResults).toEqual([]);
  });

  it('setSearchTerm updates the search term', () => {
    useConversationStore.getState().setSearchTerm('hello');
    expect(useConversationStore.getState().searchTerm).toBe('hello');
  });

  it('setSearchResults replaces search results', () => {
    const results = [
      {
        id: '1',
        type: 'direct' as const,
        name: 'Test',
        description: null,
        avatar_url: null,
        creator_id: null,
        is_archived: false,
        last_message_at: null,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      },
    ];
    useConversationStore.getState().setSearchResults(results);
    expect(useConversationStore.getState().searchResults).toEqual(results);
  });
});
