
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DragEvent, MouseEvent } from 'react';
;
import { FileAudio, FileImage, File as FileIcon, UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type FileUploadInputProps = {
  label: string;
  accept: string;
  maxSizeMB?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  preview?: boolean;
};

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const units = ['Bytes', 'KB', 'MB', 'GB'];
  const sizeIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** sizeIndex).toFixed(sizeIndex === 0 ? 0 : 1)} ${units[sizeIndex]}`;
}

export function FileUploadInput({
  label,
  accept,
  maxSizeMB = 100,
  value = null,
  onChange,
  error,
  preview = false,
}: FileUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!preview || !value || !value.type.startsWith('image/')) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [preview, value]);

  const selectFile = useCallback(
    (file: File) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setLocalError(`File must be under ${maxSizeMB}MB`);
        onChange(null);
        return;
      }

      setLocalError('');
      onChange(file);
    },
    [maxSizeMB, onChange]
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files.item(0);
      if (file) selectFile(file);
    },
    [selectFile]
  );

  const clearFile = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (inputRef.current) inputRef.current.value = '';
    setLocalError('');
    onChange(null);
  };

  const visibleError = error || localError;
  const isAudio = accept.includes('audio');
  const isImage = accept.includes('image');

  return (
    <div className="space-y-2">
      <label className="ml-1 text-xs font-bold uppercase tracking-widest text-gray-400">
        {label}
      </label>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'rounded-xl border-2 border-dashed border-white/10 bg-surface p-6 transition outline-none',
          'hover:border-[#C8A24A] hover:bg-[#C8A24A]/5 focus-visible:border-[#C8A24A] focus-visible:bg-[#C8A24A]/5',
          isDragging && 'border-[#C8A24A] bg-[#C8A24A]/5',
          visibleError && 'border-red-500/60'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.item(0);
            if (file) selectFile(file);
          }}
        />

        {value ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              {previewUrl ? (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10">
                  <img src={previewUrl} alt={`${label} preview`} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                  {isAudio ? (
                    <FileAudio size={24} />
                  ) : isImage ? (
                    <FileImage size={24} />
                  ) : (
                    <FileIcon size={24} />
                  )}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{value.name}</p>
                <p className="mt-1 text-xs text-gray-500">{formatFileSize(value.size)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={clearFile}
              className="shrink-0 rounded-full p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
              aria-label={`Clear ${label}`}
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <UploadCloud className="h-9 w-9 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-300">
                Drag file here or <span className="text-[#C8A24A]">click to upload</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">Max {maxSizeMB}MB</p>
            </div>
          </div>
        )}
      </div>

      {visibleError && <p className="ml-1 text-xs font-medium text-red-500">{visibleError}</p>}
    </div>
  );
}
