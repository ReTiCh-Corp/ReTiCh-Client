import { useConversationStore } from './useConversationStore';

const mockConversation = {
  id: '1',
  name: 'General',
  participants: ['user1', 'user2'],
  lastMessageAt: '2026-03-16T10:00:00Z',
};

const mockConversation2 = {
  id: '2',
  name: 'Random',
  participants: ['user1', 'user3'],
  lastMessageAt: '2026-03-16T11:00:00Z',
};

beforeEach(() => {
  useConversationStore.setState({
    conversations: [],
    currentConversationId: null,
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
    expect(useConversationStore.getState().conversations).toEqual(conversations);
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
    useConversationStore.getState().setConversations([mockConversation, mockConversation2]);
    useConversationStore.getState().removeConversation('1');
    expect(useConversationStore.getState().conversations).toEqual([mockConversation2]);
  });

  it('removeConversation does nothing if id not found', () => {
    useConversationStore.getState().setConversations([mockConversation]);
    useConversationStore.getState().removeConversation('999');
    expect(useConversationStore.getState().conversations).toEqual([mockConversation]);
  });
});
