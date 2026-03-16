const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Email is required.';
  if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address.';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.';
  if (password.length < PASSWORD_MIN_LENGTH)
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  if (!/[a-z]/.test(password))
    return 'Password must contain at least one lowercase letter.';
  if (!/[A-Z]/.test(password))
    return 'Password must contain at least one uppercase letter.';
  if (!/[0-9]/.test(password))
    return 'Password must contain at least one number.';
  return null;
}

export function validateUsername(username: string): string | null {
  const trimmed = username.trim();
  if (!trimmed) return 'Username is required.';
  if (trimmed.length < USERNAME_MIN_LENGTH)
    return `Username must be at least ${USERNAME_MIN_LENGTH} characters.`;
  if (trimmed.length > USERNAME_MAX_LENGTH)
    return `Username must be at most ${USERNAME_MAX_LENGTH} characters.`;
  if (!USERNAME_REGEX.test(trimmed))
    return 'Username can only contain letters, numbers, hyphens and underscores.';
  return null;
}

export function validateLoginForm(fields: {
  email: string;
  password: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  const emailError = validateEmail(fields.email);
  if (emailError) errors.email = emailError;
  if (!fields.password) errors.password = 'Password is required.';
  return errors;
}

export function validateRegisterForm(fields: {
  email: string;
  username: string;
  password: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  const emailError = validateEmail(fields.email);
  if (emailError) errors.email = emailError;
  const usernameError = validateUsername(fields.username);
  if (usernameError) errors.username = usernameError;
  const passwordError = validatePassword(fields.password);
  if (passwordError) errors.password = passwordError;
  return errors;
}
