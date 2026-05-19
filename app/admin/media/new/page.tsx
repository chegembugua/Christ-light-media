import { MediaUploadForm } from '@/modules/media';

export default function NewMediaPage() {
  return (
    <section className="space-y-6">
      <h1 className="font-cinzel text-3xl text-white">Upload media</h1>
      <p className="text-sm text-gray-500">
        Requires a public Supabase Storage bucket named <code className="text-gold">media</code>.
      </p>
      <MediaUploadForm />
    </section>
  );
}
