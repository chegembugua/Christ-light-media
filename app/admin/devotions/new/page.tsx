import { DevotionForm } from '@/modules/devotions';

export default function NewDevotionPage() {
  return (
    <section className="space-y-6">
      <h1 className="font-cinzel text-3xl text-white">New devotion</h1>
      <DevotionForm />
    </section>
  );
}
