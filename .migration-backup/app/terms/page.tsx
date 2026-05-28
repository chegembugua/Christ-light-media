import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'In For Christ Media terms of service.',
};

export default function TermsPage() {
  return (
    <article className="container mx-auto max-w-3xl px-6 pt-28 pb-16 prose prose-invert">
      <h1 className="font-cinzel text-4xl text-white">Terms of Service</h1>
      <p className="mt-4 text-gray-400">
        By using In For Christ Media you agree to use the platform for edification,
        respectful fellowship, and lawful purposes. Content must honor biblical values.
        We reserve the right to moderate or remove content that violates community standards.
      </p>
      <p className="mt-4 text-gray-400">
        Full legal terms will be published before public launch. For questions contact your
        ministry administrator.
      </p>
      <Link href="/register" className="mt-8 inline-block text-gold hover:text-white">
        ← Back to registration
      </Link>
    </article>
  );
}
