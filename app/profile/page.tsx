import type { Metadata } from 'next';
import { ProfileView } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your Christ Light Media account.',
};

export default function ProfilePage() {
  return <ProfileView />;
}
