"use client";

import { useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

interface UploadResponse {
  url: string;
  filename: string;
}

interface UploadError {
  error: string;
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = (await response.json()) as UploadError;
    throw new Error(error.error || "Failed to upload image");
  }

  const data = (await response.json()) as UploadResponse;
  return data.url;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content in markdown...",
  hasError = false,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertImageMarkdown = useCallback(
    (url: string, cursorPos?: number) => {
      const markdown = `![](${url})`;
      const textarea = textareaRef.current;

      if (textarea && cursorPos !== undefined) {
        // Insert at cursor position
        const before = value.slice(0, cursorPos);
        const after = value.slice(cursorPos);
        onChange(before + markdown + after);
      } else {
        // Append to end
        onChange(value + (value.endsWith("\n") || !value ? "" : "\n") + markdown);
      }
    },
    [value, onChange]
  );

  const handleImageUpload = useCallback(
    async (file: File, cursorPos?: number) => {
      if (!file.type.startsWith("image/")) return;

      setIsUploading(true);
      try {
        const url = await uploadImage(file);
        insertImageMarkdown(url, cursorPos);
      } catch (error) {
        console.error("Image upload failed:", error);
        alert(error instanceof Error ? error.message : "Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    },
    [insertImageMarkdown]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            const cursorPos = e.currentTarget.selectionStart;
            void handleImageUpload(file, cursorPos);
          }
          return;
        }
      }
    },
    [handleImageUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (!files?.length) return;

      const file = files[0];
      if (file?.type.startsWith("image/")) {
        const cursorPos = e.currentTarget.selectionStart;
        void handleImageUpload(file, cursorPos);
      }
    },
    [handleImageUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className={`overflow-hidden rounded-lg border bg-warm-900/50 ${
      hasError ? "border-red-500" : "border-warm-700/30"
    }`}>
      {/* Tab Header */}
      <div className="flex border-b border-warm-700/30">
        <button
          type="button"
          onClick={() => setActiveTab("write")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "write"
              ? "border-b-2 border-warm-400 text-warm-200"
              : "text-warm-400 hover:text-warm-300"
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "preview"
              ? "border-b-2 border-warm-400 text-warm-200"
              : "text-warm-400 hover:text-warm-300"
          }`}
        >
          Preview
        </button>
        {isUploading && (
          <span className="ml-auto flex items-center px-4 text-xs text-warm-400">
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Uploading...
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="relative min-h-[400px]">
        {activeTab === "write" ? (
          <>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              placeholder={placeholder}
              className={`h-full min-h-[400px] w-full resize-y bg-transparent p-4 font-mono text-sm text-warm-100 placeholder-warm-500 focus:outline-none ${
                isDragging ? "bg-warm-800/50" : ""
              }`}
            />
            {isDragging && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center border-2 border-dashed border-warm-500 bg-warm-800/80">
                <p className="text-warm-300">Drop image to upload</p>
              </div>
            )}
          </>
        ) : (
          <div className="prose prose-invert max-w-none p-4 prose-headings:text-warm-100 prose-p:text-warm-200 prose-a:text-warm-400 prose-strong:text-warm-100 prose-code:rounded prose-code:bg-warm-800 prose-code:px-1 prose-code:py-0.5 prose-code:text-warm-300 prose-pre:bg-warm-800 prose-li:text-warm-200">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-warm-500 italic">Nothing to preview</p>
            )}
          </div>
        )}
      </div>

      {/* Footer with markdown help */}
      <div className="border-t border-warm-700/30 px-4 py-2">
        <p className="text-xs text-warm-500">
          Supports GitHub-flavored markdown. Paste or drag images to upload.
        </p>
      </div>
    </div>
  );
}
