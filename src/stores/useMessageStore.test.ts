import { useMessageStore } from './useMessageStore';

describe('useMessageStore', () => {
  it('initializes with an empty state', () => {
    const state = useMessageStore.getState();
    expect(state).toEqual({});
  });
});
