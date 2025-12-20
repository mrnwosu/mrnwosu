"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { BlogTag } from "@utils/blog";

interface TagFilterProps {
  tags: BlogTag[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  postCounts?: Record<string, number>;
}

export default function TagFilter({
  tags,
  selectedTags,
  onTagsChange,
  postCounts,
}: TagFilterProps) {
  const [open, setOpen] = useState(false);

  const selectedTagNames = selectedTags
    .map((slug) => tags.find((t) => t.slug === slug)?.name)
    .filter(Boolean);

  const handleToggle = (slug: string) => {
    if (selectedTags.includes(slug)) {
      onTagsChange(selectedTags.filter((t) => t !== slug));
    } else {
      onTagsChange([...selectedTags, slug]);
    }
    setOpen(false);
  };

  const handleClearAll = () => {
    onTagsChange([]);
    setOpen(false);
  };

  return (
    <motion.div
      className="mb-8 flex justify-center sm:mb-12"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="flex items-center gap-2 rounded-full border border-warm-600 bg-warm-800/50 px-4 py-2 text-sm font-medium text-warm-200 transition-all duration-300 hover:border-warm-400 hover:bg-warm-800 hover:text-warm-100 sm:px-5 sm:py-2.5 sm:text-base"
            aria-label="Filter by tags"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>
              {selectedTags.length > 0 ? (
                <>
                  <span className="text-warm-400">Tags:</span>{" "}
                  {selectedTags.length === 1
                    ? selectedTagNames[0]
                    : `${selectedTags.length} selected`}
                </>
              ) : (
                "Filter by tags"
              )}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="max-h-80 w-64 overflow-y-auto p-2 sm:w-72"
          align="center"
        >
          <div className="space-y-1">
            {/* Clear all option */}
            <button
              onClick={handleClearAll}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedTags.length === 0
                  ? "bg-warm-500 text-warm-950"
                  : "text-warm-200 hover:bg-warm-800 hover:text-warm-100"
              }`}
            >
              <span className="font-medium">All Posts</span>
              {selectedTags.length > 0 && (
                <span className="text-xs text-warm-400">Clear</span>
              )}
            </button>

            {/* Divider */}
            <div className="my-2 h-px bg-warm-700/50" />

            {/* Tag options with checkboxes */}
            <AnimatePresence>
              {tags.map((tag, index) => {
                const isSelected = selectedTags.includes(tag.slug);
                return (
                  <motion.button
                    key={tag.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    onClick={() => handleToggle(tag.slug)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? "bg-warm-700/70 text-warm-100"
                        : "text-warm-200 hover:bg-warm-800 hover:text-warm-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {/* Checkbox */}
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                          isSelected
                            ? "border-warm-400 bg-warm-400"
                            : "border-warm-500"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-warm-950"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="text-warm-500">#</span>
                      <span>{tag.name}</span>
                    </span>
                    {postCounts && postCounts[tag.slug] !== undefined && (
                      <span className="text-xs text-warm-500">
                        {postCounts[tag.slug]}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear filter button (shown when tags are selected) */}
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -10 }}
            transition={{ duration: 0.2 }}
            onClick={() => onTagsChange([])}
            className="ml-2 flex items-center justify-center rounded-full border border-warm-600 bg-warm-800/50 p-2 text-warm-400 transition-all duration-300 hover:border-warm-400 hover:bg-warm-800 hover:text-warm-200 sm:p-2.5"
            aria-label="Clear filters"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
