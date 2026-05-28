
import { useState } from 'react';
import { useLocation } from 'wouter';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MEDIA_TYPE_OPTIONS } from '../types';
import type { MediaType } from '../types';

export function MediaUploadForm() {
  const [, navigate] = useLocation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<MediaType>('SERMON');
  const [category, setCategory] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [duration, setDuration] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!coverFile) {
      toast.error('Cover image is required');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('category', category);
    formData.append('speaker', speaker);
    formData.append('duration', duration);
    formData.append('isPublished', String(isPublished));
    formData.append('cover', coverFile);
    if (audioFile) formData.append('audio', audioFile);
    if (videoFile) formData.append('video', videoFile);

    const res = await fetch('/api/admin/media', { method: 'POST', body: formData });
    setLoading(false);

    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      toast.error(err.error ?? 'Upload failed');
      return;
    }

    toast.success('Media uploaded');
    navigate('/admin/media');
    
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Input label="Title" value={title} onChange={(e: any) => setTitle(e.target.value)} required />
      <Textarea
        label="Description"
        value={description}
        onChange={(e: any) => setDescription(e.target.value)}
      />
      <Select
        label="Type"
        value={type}
        onChange={(e: any) => setType(e.target.value as MediaType)}
        options={MEDIA_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
      />
      <Input label="Category" value={category} onChange={(e: any) => setCategory(e.target.value)} />
      <Input label="Speaker / Artist" value={speaker} onChange={(e: any) => setSpeaker(e.target.value)} />
      <Input
        label="Duration"
        placeholder="42:18"
        value={duration}
        onChange={(e: any) => setDuration(e.target.value)}
      />
      <div className="space-y-4">
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
          Cover image *
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e: any) => setCoverFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-gray-400"
        />
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
          Audio (optional)
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e: any) => setAudioFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-gray-400"
        />
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
          Video (optional)
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={(e: any) => setVideoFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-gray-400"
        />
      </div>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e: any) => setIsPublished(e.target.checked)}
          className="h-4 w-4 rounded border-white/10 bg-card text-gold"
        />
        <span className="text-sm text-gray-400">Publish immediately</span>
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload media'}
      </Button>
    </form>
  );
}
