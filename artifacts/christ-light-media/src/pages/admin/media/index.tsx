
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import toast from 'react-hot-toast';
import { FileUploadInput } from '@/components/admin/FileUploadInput';
import { MediaTable } from '@/components/admin/MediaTable';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { authFetch } from '@/lib/api/authFetch';

type MediaType = 'SERMON' | 'PODCAST' | 'MUSIC' | 'WORSHIP';

type MediaItem = {
  id: string;
  title: string;
  speaker: string | null;
  type: string;
  category: string | null;
  duration: string | null;
  coverImage: string;
  audioUrl: string;
  videoUrl: string | null;
  playCount: number;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt?: string;
};

type FormState = {
  title: string;
  speaker: string;
  type: MediaType;
  category: string;
  duration: string;
  image: File | null;
  file: File | null;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const typeOptions: { value: MediaType; label: string }[] = [
  { value: 'SERMON', label: 'Sermon' },
  { value: 'PODCAST', label: 'Podcast Episode' },
  { value: 'MUSIC', label: 'Music' },
  { value: 'WORSHIP', label: 'Worship Session' },
];

const categories: Record<MediaType, string[]> = {
  SERMON: ['Teaching', 'Prayer', 'Prophecy'],
  PODCAST: ['Faith', 'Discipleship', 'Marriage'],
  MUSIC: ['Worship', 'Gospel', 'Instrumental'],
  WORSHIP: ['Live Worship', 'Prayer Room', 'Acoustic'],
};

const initialForm: FormState = {
  title: '',
  speaker: '',
  type: 'SERMON',
  category: 'Teaching',
  duration: '',
  image: null,
  file: null,
};

const audioExtensions = ['mp3', 'wav', 'm4a'];
const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];

function getExtension(file: File) {
  return file.name.split('.').pop()?.toLowerCase() ?? '';
}

export default function AdminMediaPage() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const categoryOptions = useMemo(
    () => categories[form.type].map((category) => ({ value: category, label: category })),
    [form.type]
  );

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await authFetch('/api/admin/media');
      const data = (await response.json()) as { media?: MediaItem[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to load media uploads');
      }

      setMedia(data.media ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load media uploads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMedia();
  }, []);

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (form.title.trim().length < 3) {
      nextErrors.title = 'Title must be at least 3 characters';
    }

    if (!form.speaker.trim()) {
      nextErrors.speaker = 'Speaker or artist is required';
    }

    if (!form.category) {
      nextErrors.category = 'Category is required';
    }

    if (!form.file) {
      nextErrors.file = 'Audio file is required';
    } else if (!audioExtensions.includes(getExtension(form.file))) {
      nextErrors.file = 'Only MP3, WAV, M4A audio files are supported';
    }

    if (!form.image) {
      nextErrors.image = 'Cover image is required';
    } else if (!imageExtensions.includes(getExtension(form.image))) {
      nextErrors.image = 'Only JPG, PNG, WebP images are supported';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleTypeChange = (value: MediaType) => {
    setForm((current) => ({
      ...current,
      type: value,
      category: categories[value][0],
    }));
    setErrors((current) => ({ ...current, type: undefined, category: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('speaker', form.speaker.trim());
      formData.append('type', form.type);
      formData.append('category', form.category);
      formData.append('duration', form.duration.trim());
      if (form.file) formData.append('file', form.file);
      if (form.image) formData.append('image', form.image);

      const response = await authFetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      const data = (await response.json()) as { media?: MediaItem; error?: string };

      if (!response.ok || !data.media) {
        throw new Error(data.error ?? 'Upload failed. Please try again.');
      }

      setMedia((current) => [data.media!, ...current].slice(0, 10));
      setForm(initialForm);
      setErrors({});
      toast.success('Media uploaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const previousMedia = media;
    setMedia((current) => current.filter((item) => item.id !== id));

    try {
      const response = await authFetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Unable to delete media');
      }

      toast.success('Media deleted');
    } catch (error) {
      setMedia(previousMedia);
      toast.error(error instanceof Error ? error.message : 'Unable to delete media');
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-cinzel text-3xl text-white md:text-4xl">Media Library</h1>
        <p className="mt-2 text-sm text-gray-400">
          Upload and manage sermons, podcasts, music, and worship content
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,32rem)_1fr]">
        <section className="max-w-lg rounded-2xl border border-white/10 bg-card/80 p-5 shadow-2xl shadow-black/20">
          <h2 className="font-cinzel text-xl text-white">Upload New Media</h2>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Title"
              value={form.title}
              onChange={(event: any) => updateForm('title', event.target.value)}
              error={errors.title}
              placeholder="The Light of Christ"
              required
            />

            <Input
              label="Speaker/Artist"
              value={form.speaker}
              onChange={(event: any) => updateForm('speaker', event.target.value)}
              error={errors.speaker}
              placeholder="Pastor Grace"
              required
            />

            <Select
              label="Media Type"
              value={form.type}
              onChange={(event: any) => handleTypeChange(event.target.value as MediaType)}
              options={typeOptions}
            />

            <Select
              label="Category"
              value={form.category}
              onChange={(event: any) => updateForm('category', event.target.value)}
              options={categoryOptions}
              error={errors.category}
            />

            <Input
              label="Duration"
              value={form.duration}
              onChange={(event: any) => updateForm('duration', event.target.value)}
              error={errors.duration}
              placeholder="42:15"
            />

            <FileUploadInput
              label="Cover Image"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              maxSizeMB={10}
              value={form.image}
              onChange={(file) => updateForm('image', file)}
              error={errors.image}
              preview
            />

            <FileUploadInput
              label="Audio File"
              accept="audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/mp4a-latm,.mp3,.wav,.m4a"
              maxSizeMB={100}
              value={form.file}
              onChange={(file) => updateForm('file', file)}
              error={errors.file}
            />

            <button
              type="submit"
              disabled={uploading}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 font-semibold text-black transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-70'
              )}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Media'
              )}
            </button>
          </form>
        </section>

        <section className="min-w-0 rounded-2xl border border-white/10 bg-card/80 p-5 shadow-2xl shadow-black/20">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-cinzel text-xl text-white">Recent Uploads</h2>
          </div>

          <MediaTable
            media={media}
            loading={loading}
            onDelete={handleDelete}
            onEdit={(id) => navigate(`/admin/media/${id}`)}
          />
        </section>
      </div>
    </div>
  );
}
