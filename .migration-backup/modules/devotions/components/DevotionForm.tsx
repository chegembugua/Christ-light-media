'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import type { DevotionDTO } from '../types';

interface DevotionFormProps {
  initial?: DevotionDTO;
}

export function DevotionForm({ initial }: DevotionFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? '');
  const [verse, setVerse] = useState(initial?.verse ?? '');
  const [verseText, setVerseText] = useState(initial?.verseText ?? '');
  const [reflection, setReflection] = useState(initial?.reflection ?? '');
  const [date, setDate] = useState(
    initial?.date ? initial.date.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setLoading(true);
    const payload = { title, verse, verseText, reflection, date, isPublished };
    const url = isEdit ? `/api/admin/devotions/${initial!.id}` : '/api/admin/devotions';
    const method = isEdit ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      toast.error(err.error ?? 'Failed to save');
      return;
    }

    toast.success('Devotion saved successfully');
    router.push('/admin/devotions');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input
        label="Scripture reference"
        placeholder="John 3:16"
        value={verse}
        onChange={(e) => setVerse(e.target.value)}
      />
      <Textarea
        label="Scripture text"
        value={verseText}
        onChange={(e) => setVerseText(e.target.value)}
        placeholder="For God so loved the world..."
      />
      <Textarea
        label="Reflection"
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        className="min-h-[200px]"
      />
      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="h-4 w-4 rounded border-white/10 bg-card text-gold"
        />
        <span className="text-sm text-gray-400">Publish immediately</span>
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : isEdit ? 'Update devotion' : 'Create devotion'}
      </Button>
    </form>
  );
}
