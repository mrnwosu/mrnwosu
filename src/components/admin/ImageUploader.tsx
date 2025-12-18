"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface UploadResponse {
  url: string;
  error?: string;
}

interface ImageUploaderProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = (await response.json()) as UploadResponse;

        if (!response.ok) {
          throw new Error(data.error || "Upload failed");
        }

        onChange(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void uploadFile(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        void uploadFile(file);
      } else {
        setError("Please drop an image file");
      }
    },
    [uploadFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange(null);
  };

  if (value) {
    return (
      <div className="space-y-2">
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-warm-700/30">
          <Image
            src={value}
            alt="Featured image"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-lg border border-red-600/50 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/30"
          >
            Remove
          </button>
          <label className="cursor-pointer rounded-lg border border-warm-600 px-4 py-2 text-sm font-medium text-warm-300 transition-colors hover:bg-warm-700">
            Replace
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex aspect-video w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
          isDragging
            ? "border-warm-400 bg-warm-800/50"
            : "border-warm-700/50 hover:border-warm-600"
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-warm-500 border-t-transparent" />
            <span className="text-sm text-warm-400">Uploading...</span>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-2 p-6">
            <svg
              className="h-10 w-10 text-warm-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-warm-400">
              Drag & drop or click to upload
            </span>
            <span className="text-xs text-warm-500">
              JPEG, PNG, WebP, GIF (max 4MB)
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
