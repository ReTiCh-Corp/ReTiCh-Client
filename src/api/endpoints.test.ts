import {
  AUTH_ENDPOINTS,
  CONVERSATION_ENDPOINTS,
  MESSAGE_ENDPOINTS,
  USER_ENDPOINTS,
} from './endpoints';

describe('endpoints', () => {
  describe('AUTH_ENDPOINTS', () => {
    it('has correct login path', () => {
      expect(AUTH_ENDPOINTS.LOGIN).toBe('/auth/login');
    });

    it('has correct register path', () => {
      expect(AUTH_ENDPOINTS.REGISTER).toBe('/auth/register');
    });

    it('has correct refresh path', () => {
      expect(AUTH_ENDPOINTS.REFRESH).toBe('/auth/refresh');
    });

    it('has correct logout path', () => {
      expect(AUTH_ENDPOINTS.LOGOUT).toBe('/auth/logout');
    });
  });

  describe('USER_ENDPOINTS', () => {
    it('has correct me path', () => {
      expect(USER_ENDPOINTS.ME).toBe('/users/me');
    });

    it('generates correct by-id path', () => {
      expect(USER_ENDPOINTS.BY_ID('123')).toBe('/users/123');
    });
  });

  describe('CONVERSATION_ENDPOINTS', () => {
    it('has correct list path', () => {
      expect(CONVERSATION_ENDPOINTS.LIST).toBe('/conversations');
    });

    it('generates correct by-id path', () => {
      expect(CONVERSATION_ENDPOINTS.BY_ID('456')).toBe('/conversations/456');
    });

    it('has correct create path', () => {
      expect(CONVERSATION_ENDPOINTS.CREATE).toBe('/conversations');
    });
  });

  describe('MESSAGE_ENDPOINTS', () => {
    it('generates correct by-conversation path', () => {
      expect(MESSAGE_ENDPOINTS.BY_CONVERSATION('789')).toBe(
        '/conversations/789/messages',
      );
    });

    it('generates correct send path', () => {
      expect(MESSAGE_ENDPOINTS.SEND('789')).toBe('/conversations/789/messages');
    });
  });
});
