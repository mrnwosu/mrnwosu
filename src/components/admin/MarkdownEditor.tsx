"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content in markdown...",
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="overflow-hidden rounded-lg border border-warm-700/30 bg-warm-900/50">
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
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === "write" ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="h-full min-h-[400px] w-full resize-y bg-transparent p-4 font-mono text-sm text-warm-100 placeholder-warm-500 focus:outline-none"
          />
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
          Supports GitHub-flavored markdown: **bold**, *italic*, `code`, links,
          lists, and more
        </p>
      </div>
    </div>
  );
}
