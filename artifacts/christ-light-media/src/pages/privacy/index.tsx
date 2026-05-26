import { Link } from 'wouter';

export default function PrivacyPage() {
  return (
    <article className="container mx-auto max-w-3xl px-6 pt-28 pb-16">
      <h1 className="font-cinzel text-4xl text-white">Privacy Policy</h1>
      <p className="mt-4 text-gray-400">
        We collect account information (email, name) and usage data to provide sermons,
        courses, prayer features, and giving. Data is stored securely via Supabase and
        is not sold to third parties.
      </p>
      <p className="mt-4 text-gray-400">
        You may request account deletion by contacting support. A complete privacy policy
        will be published before public launch.
      </p>
      <Link href="/register" className="mt-8 inline-block text-gold hover:text-white">
        ← Back to registration
      </Link>
    </article>
  );
}
