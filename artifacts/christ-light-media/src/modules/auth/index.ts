/**
 * Auth module — public API
 * @module auth
 */

// Components
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { ForgotPasswordForm } from './components/ForgotPasswordForm';
export { ResetPasswordForm } from './components/ResetPasswordForm';
export { ProfileView } from './components/ProfileView';
export { AuthCard } from './components/AuthCard';

// Types
export type {
  AuthUser,
  UserProfile,
  AuthResult,
  LoginInput,
  RegisterInput,
  AuthContextValue,
} from './types';

// Validators (for forms outside this module)
export {
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateNewPassword,
} from './lib/validators';

