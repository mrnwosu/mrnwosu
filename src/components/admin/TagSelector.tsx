"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@utils/api";

interface TagSelectorProps {
  selectedIds: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagSelector({ selectedIds, onChange }: TagSelectorProps) {
  const value = selectedIds;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: tags, isLoading } = api.tag.getAll.useQuery();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedTags = tags?.filter((tag) => value.includes(tag.id)) ?? [];
  const availableTags = tags?.filter((tag) => !value.includes(tag.id)) ?? [];

  const handleToggleTag = (tagId: string) => {
    if (value.includes(tagId)) {
      onChange(value.filter((id) => id !== tagId));
    } else {
      onChange([...value, tagId]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onChange(value.filter((id) => id !== tagId));
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 rounded-full bg-warm-700/50 px-3 py-1 text-sm text-warm-200"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="ml-1 text-warm-400 hover:text-warm-200"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-warm-700/30 bg-warm-900/50 px-4 py-2.5 text-left text-warm-300 transition-colors hover:border-warm-600"
        >
          <span>
            {selectedTags.length > 0
              ? `${selectedTags.length} tag${selectedTags.length > 1 ? "s" : ""} selected`
              : "Select tags..."}
          </span>
          <svg
            className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-warm-700/30 bg-warm-900 shadow-lg">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-warm-400">
                Loading tags...
              </div>
            ) : availableTags.length === 0 && selectedTags.length === 0 ? (
              <div className="px-4 py-3 text-sm text-warm-400">
                No tags available. Create tags from the admin dashboard.
              </div>
            ) : availableTags.length === 0 ? (
              <div className="px-4 py-3 text-sm text-warm-400">
                All tags selected
              </div>
            ) : (
              availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleToggleTag(tag.id)}
                  className="flex w-full items-center px-4 py-2.5 text-left text-sm text-warm-200 transition-colors hover:bg-warm-800"
                >
                  <span className="flex-1">{tag.name}</span>
                  {value.includes(tag.id) && (
                    <svg
                      className="h-4 w-4 text-warm-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
