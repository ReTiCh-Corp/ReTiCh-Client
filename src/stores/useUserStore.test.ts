import { useUserStore } from './useUserStore';

beforeEach(() => {
  useUserStore.setState({
    searchTerm: '',
  });
});

describe('useUserStore', () => {
  it('has correct initial state', () => {
    const state = useUserStore.getState();
    expect(state.searchTerm).toBe('');
  });

  it('setSearchTerm updates the search term', () => {
    useUserStore.getState().setSearchTerm('alice');
    expect(useUserStore.getState().searchTerm).toBe('alice');
  });

  it('setSearchTerm can reset to empty', () => {
    useUserStore.getState().setSearchTerm('alice');
    useUserStore.getState().setSearchTerm('');
    expect(useUserStore.getState().searchTerm).toBe('');
  });
});
