/**
 * Client-side auth form validation.
 */
export interface ValidationErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(email: string, password: string): string | null {
  if (!email.trim() || !password) return 'Please enter both email and password.';
  if (!EMAIL_RE.test(email)) return 'Please enter a valid email address.';
  return null;
}

export function validateRegister(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
  agreeTerms: boolean
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (fullName.trim().length < 2) errors.fullName = 'Name is too short.';
  if (!EMAIL_RE.test(email)) errors.email = 'Invalid email address.';
  if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  if (!agreeTerms) errors.terms = 'You must agree to the terms.';

  return errors;
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateForgotPassword(email: string): string | null {
  if (!email.trim()) return 'Please enter your email address.';
  if (!EMAIL_RE.test(email)) return 'Please enter a valid email address.';
  return null;
}

export function validateNewPassword(password: string, confirmPassword: string): string | null {
  if (password.length < 6) return 'Password must be at least 6 characters.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return null;
}
