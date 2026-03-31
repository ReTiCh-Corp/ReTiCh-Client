import { useMessageStore } from './useMessageStore';

describe('useMessageStore', () => {
  it('initializes with default state', () => {
    const state = useMessageStore.getState();
    expect(state.drafts).toEqual({});
    expect(state.editingMessage).toBeNull();
    expect(state.replyingTo).toBeNull();
    expect(state.typingUsers).toEqual({});
  });

  it('sets and clears drafts', () => {
    useMessageStore.getState().setDraft('conv-1', 'hello');
    expect(useMessageStore.getState().drafts['conv-1']).toBe('hello');

    useMessageStore.getState().clearDraft('conv-1');
    expect(useMessageStore.getState().drafts['conv-1']).toBeUndefined();
  });
});
