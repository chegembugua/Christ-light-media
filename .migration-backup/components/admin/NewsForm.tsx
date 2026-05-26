'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FileUploadInput } from '@/components/admin/FileUploadInput';
import { generateSlug } from '@/lib/utils/slug';

export type News = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type NewsFormProps = {
  mode: 'create' | 'edit';
  article?: News;
  onSubmit?: (article: News) => void;
};

type Errors = Partial<
  Record<'title' | 'slug' | 'excerpt' | 'category' | 'featuredImage' | 'content', string>
>;

const categories = ['Theology', 'Ministry', 'Events', 'Global', 'Education', 'Community'];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Unable to read featured image.'));
    reader.readAsDataURL(file);
  });
}

export function NewsForm({ mode, article, onSubmit }: NewsFormProps) {
  const router = useRouter();
  const isEdit = mode === 'edit';
  const userEditedSlug = useRef(Boolean(article?.slug));

  const [title, setTitle] = useState(article?.title ?? '');
  const [slug, setSlug] = useState(article?.slug ?? '');
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '');
  const [category, setCategory] = useState(article?.category ?? '');
  const [content, setContent] = useState(article?.content ?? '');
  const [author, setAuthor] = useState(article?.author ?? '');
  const [isPublished, setIsPublished] = useState(article?.isPublished ?? false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState(article?.coverImage ?? '');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!article) return;
    setTitle(article.title);
    setSlug(article.slug);
    setExcerpt(article.excerpt);
    setCategory(article.category);
    setContent(article.content);
    setAuthor(article.author ?? '');
    setIsPublished(article.isPublished);
    setExistingImage(article.coverImage);
    setImageFile(null);
    userEditedSlug.current = true;
  }, [article]);

  useEffect(() => {
    if (userEditedSlug.current) return;
    const timeout = window.setTimeout(() => {
      setSlug(generateSlug(title));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [title]);

  const validate = () => {
    const nextErrors: Errors = {};

    if (!title.trim()) nextErrors.title = 'Title is required.';
    else if (title.trim().length < 5) nextErrors.title = 'Title must be at least 5 characters.';
    else if (title.trim().length > 100) nextErrors.title = 'Title must be 100 characters or less.';

    if (!slug.trim()) nextErrors.slug = 'Slug is required.';
    else if (!slugPattern.test(slug.trim())) {
      nextErrors.slug = 'Use lowercase letters, numbers, and hyphens only.';
    }

    if (!excerpt.trim()) nextErrors.excerpt = 'Excerpt is required.';
    else if (excerpt.trim().length > 160) nextErrors.excerpt = 'Excerpt must be 160 characters or less.';

    if (!category) nextErrors.category = 'Category is required.';
    if (!imageFile && !existingImage) nextErrors.featuredImage = 'Featured image is required.';

    if (!content.trim()) nextErrors.content = 'Content is required.';
    else if (content.trim().length < 200) {
      nextErrors.content = 'Content must be at least 200 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setCategory('');
    setContent('');
    setAuthor('');
    setIsPublished(false);
    setImageFile(null);
    setExistingImage('');
    setErrors({});
    userEditedSlug.current = false;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const featuredImage = imageFile
        ? await readFileAsDataUrl(imageFile)
        : existingImage || undefined;
      const response = await fetch(
        isEdit && article ? `/api/admin/news/${article.slug}` : '/api/admin/news',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim(),
            category,
            featuredImage,
            content: content.trim(),
            author: author.trim() || null,
            isPublished,
          }),
        }
      );
      const result = (await response.json()) as { article?: News; error?: string };

      if (!response.ok || !result.article) {
        throw new Error(result.error ?? 'Unable to save article.');
      }

      toast.success('Article saved successfully');
      onSubmit?.(result.article);

      if (isEdit) {
        router.push('/admin/news');
        router.refresh();
      } else {
        resetForm();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-cinzel text-2xl text-white">
          {isEdit ? 'Edit Article' : 'Create Article'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Publish ministry updates, event reports, and Christian news.
        </p>
      </div>

      <Input
        label="Title"
        placeholder="New Worship Center Opens in Kenya"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          if (!userEditedSlug.current) setSlug(generateSlug(event.target.value));
        }}
        error={errors.title}
        maxLength={100}
        required
      />

      <div className="space-y-2">
        <Input
          label="Slug"
          placeholder="new-worship-center-opens-in-kenya"
          value={slug}
          onChange={(event) => {
            userEditedSlug.current = true;
            setSlug(generateSlug(event.target.value));
          }}
          error={errors.slug}
          required
        />
        <p className="ml-1 text-xs text-gray-500">Generated slug: {slug || 'article-slug'}</p>
      </div>

      <div className="space-y-1.5">
        <Textarea
          label="Excerpt"
          placeholder="A brief summary of the article..."
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          error={errors.excerpt}
          maxLength={180}
          className="min-h-[96px]"
          required
        />
        <p className={`ml-1 text-xs ${excerpt.trim().length > 160 ? 'text-red-400' : 'text-gray-500'}`}>
          {excerpt.trim().length} / 160
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="ml-1 text-xs font-bold uppercase tracking-widest text-gray-400">
          Category
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={`w-full rounded-xl border bg-card px-4 py-3.5 text-sm text-white outline-none transition focus:border-gold/60 ${
            errors.category ? 'border-red-500/60' : 'border-white/10'
          }`}
          required
        >
          <option value="">Select category</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="ml-1 text-[10px] font-bold uppercase tracking-tight text-red-500">
            {errors.category}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <FileUploadInput
          label="Featured Image"
          accept="image/*"
          maxSizeMB={8}
          value={imageFile}
          onChange={setImageFile}
          error={errors.featuredImage}
          preview
        />
        <p className="ml-1 text-xs text-gray-500">Recommended: 1200x630, 16:9.</p>
        {!imageFile && existingImage && (
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-card p-3">
            <div className="flex items-center gap-3">
              <img
                src={existingImage}
                alt="Current featured image"
                className="h-16 w-24 rounded-lg object-cover"
              />
              <p className="text-sm text-gray-300">Current featured image</p>
            </div>
            <button
              type="button"
              onClick={() => setExistingImage('')}
              className="rounded-full p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
              aria-label="Clear current featured image"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Textarea
          label="Content"
          placeholder="Write the full article..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          error={errors.content}
          className="min-h-[320px]"
          required
        />
        <p className="ml-1 text-xs text-gray-500">{content.trim().length.toLocaleString()} / min 200</p>
      </div>

      <Input
        label="Author"
        placeholder="Staff Writer"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
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
        <Button type="submit" size="lg" disabled={loading} className="w-full py-3">
          {loading ? 'Saving...' : 'Save Article'}
        </Button>
        <Button
          type="button"
          variant="surface"
          className="w-full"
          onClick={() => router.push('/admin/news')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
