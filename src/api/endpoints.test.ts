import {
  AUTH_ENDPOINTS,
  CONVERSATION_ENDPOINTS,
  MESSAGE_ENDPOINTS,
  USER_ENDPOINTS,
} from './endpoints';

describe('endpoints', () => {
  describe('AUTH_ENDPOINTS', () => {
    it('has correct login path', () => {
      expect(AUTH_ENDPOINTS.LOGIN).toBe('/api/v1/auth/login');
    });

    it('has correct register path', () => {
      expect(AUTH_ENDPOINTS.REGISTER).toBe('/api/v1/auth/register');
    });

    it('has correct refresh path', () => {
      expect(AUTH_ENDPOINTS.REFRESH).toBe('/api/v1/auth/refresh');
    });

    it('has correct logout path', () => {
      expect(AUTH_ENDPOINTS.LOGOUT).toBe('/api/v1/auth/logout');
    });
  });

  describe('USER_ENDPOINTS', () => {
    it('has correct me path', () => {
      expect(USER_ENDPOINTS.ME).toBe('/api/v1/users/me');
    });

    it('generates correct by-id path', () => {
      expect(USER_ENDPOINTS.BY_ID('123')).toBe('/api/v1/users/123');
    });
  });

  describe('CONVERSATION_ENDPOINTS', () => {
    it('has correct list path', () => {
      expect(CONVERSATION_ENDPOINTS.LIST).toBe('/api/v1/conversations');
    });

    it('generates correct by-id path', () => {
      expect(CONVERSATION_ENDPOINTS.BY_ID('456')).toBe(
        '/api/v1/conversations/456',
      );
    });

    it('has correct create path', () => {
      expect(CONVERSATION_ENDPOINTS.CREATE).toBe('/api/v1/conversations');
    });

    it('generates correct participants path', () => {
      expect(CONVERSATION_ENDPOINTS.PARTICIPANTS('456')).toBe(
        '/api/v1/conversations/456/participants',
      );
    });

    it('generates correct participant path', () => {
      expect(CONVERSATION_ENDPOINTS.PARTICIPANT('456', '789')).toBe(
        '/api/v1/conversations/456/participants/789',
      );
    });
  });

  describe('MESSAGE_ENDPOINTS', () => {
    it('generates correct by-conversation path', () => {
      expect(MESSAGE_ENDPOINTS.BY_CONVERSATION('789')).toBe(
        '/api/v1/conversations/789/messages',
      );
    });

    it('generates correct send path', () => {
      expect(MESSAGE_ENDPOINTS.SEND('789')).toBe(
        '/api/v1/conversations/789/messages',
      );
    });
  });
});
