'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { UploadCloud, X, FileAudio, FileImage, File as FileIcon } from 'lucide-react';
import Image from 'next/image';

interface FileUploadInputProps {
  label: string;
  accept: string;
  maxSizeMB?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  preview?: boolean;
}

export function FileUploadInput({
  label,
  accept,
  maxSizeMB = 100,
  value,
  onChange,
  error,
  preview = false,
}: FileUploadInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate local preview URL if needed
  useEffect(() => {
    if (value && preview && value.type.startsWith('image/')) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value, preview]);

  const validateAndSelect = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File exceeds maximum size of ${maxSizeMB}MB`);
      onChange(null);
    } else {
      setLocalError('');
      onChange(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndSelect(e.dataTransfer.files[0]);
      }
    },
    [maxSizeMB, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) inputRef.current.value = '';
    onChange(null);
    setLocalError('');
  };

  const isAudio = accept.includes('audio');
  const isImage = accept.includes('image');

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-300">{label}</label>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
          isDragging
            ? 'border-[#C8A24A] bg-[#C8A24A]/5'
            : value
            ? 'border-white/20 bg-white/5 hover:border-white/30'
            : 'border-white/10 bg-[#121212] hover:border-white/30 hover:bg-white/5'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />

        {value ? (
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-4 flex-1 overflow-hidden">
              {preview && previewUrl ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                  {isAudio ? <FileAudio size={24} /> : isImage ? <FileImage size={24} /> : <FileIcon size={24} />}
                </div>
              )}
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{value.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(value.size)}</p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors shrink-0"
              title="Remove file"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center opacity-80">
            <UploadCloud size={36} className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-300">
                Drag file here or <span className="text-[#C8A24A]">click to upload</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: {accept.replace(/\/\*/g, '').replace(/,/g, ', ')} (Max {maxSizeMB}MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {(error || localError) && (
        <p className="text-xs text-red-500 mt-1 font-medium">{error || localError}</p>
      )}
    </div>
  );
}
