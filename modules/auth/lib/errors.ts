/**
 * Maps Supabase auth error messages to user-friendly copy.
 */
export function mapAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes('invalid login credentials')) {
    return 'Incorrect email or password.';
  }
  if (normalized.includes('user already registered') || normalized.includes('already been registered')) {
    return 'An account with this email already exists.';
  }
  if (normalized.includes('email not confirmed')) {
    return 'Please check your email to confirm your account.';
  }
  if (normalized.includes('password should be at least')) {
    return 'Password must be at least 6 characters.';
  }
  if (normalized.includes('unable to validate email')) {
    return 'Please enter a valid email address.';
  }
  if (normalized.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  return message;
}
