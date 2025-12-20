"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { api } from "@utils/api";

// Represents a tag that hasn't been saved to the database yet
export interface PendingTag {
  tempId: string; // Temporary ID for local state (prefixed with "pending_")
  name: string;
}

interface TagSelectorProps {
  selectedIds: string[];
  onChange: (tagIds: string[]) => void;
  pendingTags?: PendingTag[];
  onPendingTagsChange?: (pendingTags: PendingTag[]) => void;
}

export function TagSelector({
  selectedIds,
  onChange,
  pendingTags = [],
  onPendingTagsChange,
}: TagSelectorProps) {
  const value = selectedIds;
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    // Check if it's a pending tag
    if (tagId.startsWith("pending_")) {
      onPendingTagsChange?.(pendingTags.filter((t) => t.tempId !== tagId));
      onChange(value.filter((id) => id !== tagId));
    } else {
      onChange(value.filter((id) => id !== tagId));
    }
  };

  const handleAddNewTag = useCallback(() => {
    const trimmedName = newTagName.trim();
    if (!trimmedName) return;

    // Check if tag already exists in database
    const existingTag = tags?.find(
      (t) => t.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existingTag) {
      // Just select the existing tag
      if (!value.includes(existingTag.id)) {
        onChange([...value, existingTag.id]);
      }
      setNewTagName("");
      return;
    }

    // Check if tag already exists in pending tags
    const existingPending = pendingTags.find(
      (t) => t.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existingPending) {
      // Just select the existing pending tag
      if (!value.includes(existingPending.tempId)) {
        onChange([...value, existingPending.tempId]);
      }
      setNewTagName("");
      return;
    }

    // Create new pending tag
    const tempId = `pending_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newPendingTag: PendingTag = {
      tempId,
      name: trimmedName,
    };

    onPendingTagsChange?.([...pendingTags, newPendingTag]);
    onChange([...value, tempId]);
    setNewTagName("");
  }, [newTagName, tags, pendingTags, value, onChange, onPendingTagsChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewTag();
    }
  };

  // Get selected pending tags
  const selectedPendingTags = pendingTags.filter((t) => value.includes(t.tempId));

  return (
    <div className="space-y-2" ref={dropdownRef}>
      {/* Selected Tags (both saved and pending) */}
      {(selectedTags.length > 0 || selectedPendingTags.length > 0) && (
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
          {/* Pending tags have a different style to indicate they're not saved yet */}
          {selectedPendingTags.map((tag) => (
            <span
              key={tag.tempId}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-warm-500 bg-warm-800/50 px-3 py-1 text-sm text-warm-300"
              title="This tag will be created when you save the post"
            >
              {tag.name}
              <span className="ml-0.5 text-xs text-warm-500">(new)</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.tempId)}
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
          <div className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-warm-700/30 bg-warm-900 shadow-lg">
            {/* Add new tag input */}
            <div className="border-b border-warm-700/30 p-2">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type to add new tag..."
                  className="flex-1 rounded border border-warm-700/30 bg-warm-800 px-3 py-1.5 text-sm text-warm-100 placeholder-warm-500 focus:border-warm-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddNewTag}
                  disabled={!newTagName.trim()}
                  className="rounded bg-warm-700 px-3 py-1.5 text-sm text-warm-200 transition-colors hover:bg-warm-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Existing tags list */}
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-warm-400">
                Loading tags...
              </div>
            ) : availableTags.length === 0 && selectedTags.length === 0 && selectedPendingTags.length === 0 ? (
              <div className="px-4 py-3 text-sm text-warm-400">
                No tags yet. Type above to create one.
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
