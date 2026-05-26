
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { authFetch } from '@/lib/api/authFetch';

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
  isPublished: boolean;
};

type FormState = {
  title: string;
  speaker: string;
  type: string;
  category: string;
  duration: string;
  coverImage: string;
  audioUrl: string;
  videoUrl: string;
  isPublished: boolean;
};

const typeOptions = [
  { value: 'SERMON', label: 'Sermon' },
  { value: 'PODCAST', label: 'Podcast' },
  { value: 'MUSIC', label: 'Music' },
  { value: 'WORSHIP', label: 'Worship' },
];

export default function AdminMediaEditPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: '',
    speaker: '',
    type: 'SERMON',
    category: '',
    duration: '',
    coverImage: '',
    audioUrl: '',
    videoUrl: '',
    isPublished: false,
  });

  useEffect(() => {
    async function fetchMedia() {
      try {
        const response = await authFetch(`/api/admin/media/${params.id}`);
        const result = (await response.json()) as { media?: MediaItem; error?: string };

        if (response.status === 404) {
          toast.error('Media item not found.');
          navigate('/admin/media');
          return;
        }

        if (!response.ok || !result.media) {
          throw new Error(result.error ?? 'Unable to load media item.');
        }

        const m = result.media;
        setForm({
          title: m.title,
          speaker: m.speaker ?? '',
          type: m.type,
          category: m.category ?? '',
          duration: m.duration ?? '',
          coverImage: m.coverImage,
          audioUrl: m.audioUrl,
          videoUrl: m.videoUrl ?? '',
          isPublished: m.isPublished,
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Unable to load media item.');
      } finally {
        setLoading(false);
      }
    }
    void fetchMedia();
  }, [params.id, navigate]);

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await authFetch(`/api/admin/media/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          speaker: form.speaker.trim(),
          type: form.type,
          category: form.category.trim(),
          duration: form.duration.trim() || null,
          coverImage: form.coverImage.trim(),
          audioUrl: form.audioUrl.trim(),
          videoUrl: form.videoUrl.trim() || null,
          isPublished: form.isPublished,
        }),
      });
      const data = (await response.json()) as { media?: MediaItem; error?: string };
      if (!response.ok || !data.media) throw new Error(data.error ?? 'Update failed.');
      toast.success('Media updated successfully');
      navigate('/admin/media');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <button
          type="button"
          onClick={() => navigate('/admin/media')}
          className="text-sm text-gray-400 hover:text-gold mb-2"
        >
          ← Back to Media Library
        </button>
        <h1 className="font-cinzel text-3xl text-white">Edit Media</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-card/80 p-6">
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => updateForm('title', e.target.value)}
          required
        />
        <Input
          label="Speaker / Artist"
          value={form.speaker}
          onChange={(e) => updateForm('speaker', e.target.value)}
          required
        />
        <Select
          label="Type"
          value={form.type}
          options={typeOptions}
          onChange={(e) => updateForm('type', e.target.value)}
        />
        <Input
          label="Category"
          value={form.category}
          onChange={(e) => updateForm('category', e.target.value)}
        />
        <Input
          label="Duration (e.g. 45:30)"
          value={form.duration}
          onChange={(e) => updateForm('duration', e.target.value)}
        />
        <Input
          label="Cover Image URL"
          value={form.coverImage}
          onChange={(e) => updateForm('coverImage', e.target.value)}
        />
        <Input
          label="Audio URL"
          value={form.audioUrl}
          onChange={(e) => updateForm('audioUrl', e.target.value)}
        />
        <Input
          label="Video URL (optional)"
          value={form.videoUrl}
          onChange={(e) => updateForm('videoUrl', e.target.value)}
        />
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => updateForm('isPublished', e.target.checked)}
            className="h-4 w-4 rounded border-white/20 text-gold"
          />
          <span className="text-sm text-gray-300">Published</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl bg-gold text-black font-semibold py-2.5 hover:bg-gold-light disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/media')}
            className="px-5 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
