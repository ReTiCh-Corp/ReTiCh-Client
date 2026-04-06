import { ReTiChAuth } from '@retish/auth';

export const auth = new ReTiChAuth({
  baseUrl: import.meta.env.VITE_AUTH_BASE_URL,
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
  clientSecret: import.meta.env.VITE_AUTH_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_AUTH_REDIRECT_URI,
});
