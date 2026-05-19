import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your Christ Light Media account.',
};

/** Protected route — middleware redirects unauthenticated users to /login. */
export default function ProfilePage() {
  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="font-cinzel text-4xl text-white">My Profile</h1>
      <p className="mt-3 text-gray-400">Manage your account, enrollments, and activity.</p>
    </section>
  );
}
