
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authFetch } from '@/lib/api/authFetch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadInput } from '@/components/admin/FileUploadInput';

export type Devotion = {
  id: string;
  title: string;
  verse: string;
  verseText: string | null;
  reflection: string;
  date: string;
  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type DevotionFormProps = {
  mode: 'create' | 'edit';
  devotion?: Devotion;
  onSubmit?: (devotion: Devotion) => void;
};

type FormErrors = Partial<Record<'title' | 'verse' | 'reflection' | 'date' | 'image', string>>;

const versePattern = /^[A-Za-z0-9\s:]+$/;

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function dateInputValue(date?: string) {
  if (!date) return todayInputValue();
  return new Date(date).toISOString().slice(0, 10);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Unable to read image file.'));
    reader.readAsDataURL(file);
  });
}

export function DevotionForm({ mode, devotion, onSubmit }: DevotionFormProps) {
  const [, navigate] = useLocation();
  const isEdit = mode === 'edit';

  const [title, setTitle] = useState(devotion?.title ?? '');
  const [verse, setVerse] = useState(devotion?.verse ?? '');
  const [verseText, setVerseText] = useState(devotion?.verseText ?? '');
  const [reflection, setReflection] = useState(devotion?.reflection ?? '');
  const [date, setDate] = useState(dateInputValue(devotion?.date));
  const [isPublished, setIsPublished] = useState(devotion?.isPublished ?? false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState(devotion?.imageUrl ?? '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!devotion) return;
    setTitle(devotion.title);
    setVerse(devotion.verse);
    setVerseText(devotion.verseText ?? '');
    setReflection(devotion.reflection);
    setDate(dateInputValue(devotion.date));
    setIsPublished(devotion.isPublished);
    setExistingImageUrl(devotion.imageUrl ?? '');
    setImageFile(null);
  }, [devotion]);

  const heading = useMemo(() => (isEdit ? 'Edit Devotion' : 'Create Devotion'), [isEdit]);

  const validate = () => {
    const nextErrors: FormErrors = {};
    const trimmedTitle = title.trim();
    const trimmedVerse = verse.trim();
    const trimmedReflection = reflection.trim();

    if (!trimmedTitle) nextErrors.title = 'Title is required.';
    else if (trimmedTitle.length < 5) nextErrors.title = 'Title must be at least 5 characters.';

    if (!trimmedVerse) nextErrors.verse = 'Bible verse is required.';
    else if (!versePattern.test(trimmedVerse)) {
      nextErrors.verse = 'Use a reference like John 3:16 or Psalm 23.';
    }

    if (!trimmedReflection) nextErrors.reflection = 'Reflection is required.';
    else if (trimmedReflection.length < 100) {
      nextErrors.reflection = 'Reflection must be at least 100 characters.';
    }

    if (!date) nextErrors.date = 'Date is required.';
    else if (Number.isNaN(new Date(`${date}T00:00:00`).getTime())) {
      nextErrors.date = 'Choose a valid date.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setTitle('');
    setVerse('');
    setVerseText('');
    setReflection('');
    setDate(todayInputValue());
    setIsPublished(false);
    setImageFile(null);
    setExistingImageUrl('');
    setErrors({});
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const imageUrl = imageFile ? await readFileAsDataUrl(imageFile) : existingImageUrl || null;
      const payload = {
        title: title.trim(),
        verse: verse.trim(),
        verseText: verseText.trim() || null,
        reflection: reflection.trim(),
        date,
        isPublished,
        imageUrl,
      };
      const response = await authFetch(
        isEdit && devotion ? `/api/admin/devotions/${devotion.id}` : '/api/admin/devotions',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const result = (await response.json()) as { devotion?: Devotion; error?: string };

      if (!response.ok || !result.devotion) {
        throw new Error(result.error ?? 'Unable to save devotion.');
      }

      toast.success('Devotion saved successfully');
      onSubmit?.(result.devotion);

      if (isEdit) {
        navigate('/admin/devotions');
        
      } else {
        resetForm();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save devotion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-cinzel text-2xl text-white">{heading}</h2>
        <p className="mt-1 text-sm text-gray-500">
          Schedule Scripture and reflection for the daily devotion archive.
        </p>
      </div>

      <Input
        label="Title"
        placeholder="e.g., Faith in the Storm"
        value={title}
        onChange={(event: any) => setTitle(event.target.value)}
        error={errors.title}
        required
      />

      <Input
        label="Bible Verse"
        placeholder="John 3:16 or Psalm 23:1-4"
        value={verse}
        onChange={(event: any) => setVerse(event.target.value)}
        error={errors.verse}
        required
      />

      <Textarea
        label="Verse Text"
        placeholder="For God so loved the world..."
        value={verseText}
        onChange={(event: any) => setVerseText(event.target.value)}
      />

      <div className="space-y-1.5">
        <Textarea
          label="Reflection"
          placeholder="Write the reflection on today's verse..."
          value={reflection}
          onChange={(event: any) => setReflection(event.target.value)}
          error={errors.reflection}
          className="min-h-[240px]"
          required
        />
        <p className="ml-1 text-xs text-gray-500">{reflection.trim().length} / min 100</p>
      </div>

      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(event: any) => setDate(event.target.value)}
        error={errors.date}
        required
      />

      <fieldset className="space-y-3">
        <legend className="ml-1 text-xs font-bold uppercase tracking-widest text-gray-400">
          Status
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: 'Draft', value: false },
            { label: 'Published', value: true },
          ].map((option) => (
            <label
              key={option.label}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-card px-4 py-3 text-sm text-gray-300 transition hover:border-gold/40"
            >
              <input
                type="radio"
                checked={isPublished === option.value}
                onChange={() => setIsPublished(option.value)}
                className="h-4 w-4 border-white/20 bg-bg text-gold focus:ring-gold"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-3">
        <FileUploadInput
          label="Image"
          accept="image/*"
          maxSizeMB={8}
          value={imageFile}
          onChange={setImageFile}
          error={errors.image}
          preview
        />
        {!imageFile && existingImageUrl && (
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-card p-3">
            <div className="flex items-center gap-3">
              <img
                src={existingImageUrl}
                alt="Existing devotion cover"
                className="h-16 w-16 rounded-lg object-cover"
              />
              <p className="text-sm text-gray-300">Current cover image</p>
            </div>
            <button
              type="button"
              onClick={() => setExistingImageUrl('')}
              className="rounded-full p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
              aria-label="Clear current image"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Button type="submit" size="lg" disabled={loading} className="w-full py-3">
          {loading ? 'Saving...' : 'Save Devotion'}
        </Button>
        <Button
          type="button"
          variant="surface"
          className="w-full"
          onClick={() => navigate('/admin/devotions')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
