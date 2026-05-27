import { Suspense } from 'react';
import { LoginForm } from '@/modules/auth';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-3xl bg-surface" />}>
      <LoginForm />
    </Suspense>
  );
}
