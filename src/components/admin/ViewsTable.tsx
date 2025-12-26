"use client";

import { useState } from "react";
import { api } from "@utils/trpc-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type SortField = "createdAt" | "pathname" | "country" | "city";
type SortOrder = "asc" | "desc";
type GroupBy = "none" | "pathname" | "country" | "city";

export function ViewsTable() {
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const { data, isLoading } = api.analytics.getRecentViews.useQuery({
    limit: pageSize,
    offset: page * pageSize,
    sortBy,
    sortOrder,
    groupBy,
  });

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      // Toggle order if clicking same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Default to desc for new column
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(0); // Reset to first page on sort change
  };

  const handleGroupChange = (value: GroupBy) => {
    setGroupBy(value);
    setPage(0); // Reset to first page on group change
    // When grouped, sort by count instead of timestamp
    if (value !== "none") {
      setSortBy("createdAt"); // This will be ignored for grouped queries, but keeps state consistent
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) {
      return <span className="ml-1 text-warm-600">⇅</span>;
    }
    return (
      <span className="ml-1 text-warm-300">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-12 rounded-lg border border-warm-700/30 bg-warm-800/30"
          />
        ))}
      </div>
    );
  }

  if (!data || data.views.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-warm-700/30 bg-warm-900/30 text-warm-500">
        No page views recorded yet
      </div>
    );
  }

  const isGrouped = data?.isGrouped ?? false;

  return (
    <div className="space-y-4">
      {/* Group By Filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-warm-300">Group by:</label>
        <div className="flex items-center gap-2">
          <select
            value={groupBy === "none" ? "" : groupBy}
            onChange={(e) => handleGroupChange((e.target.value || "none") as GroupBy)}
            className="rounded-lg border border-warm-700/30 bg-warm-900/50 px-3 py-2 text-sm text-warm-200 hover:bg-warm-800/50 focus:border-warm-600 focus:outline-none focus:ring-2 focus:ring-warm-600/20"
          >
            <option value="">--</option>
            <option value="pathname">Page</option>
            <option value="city">City</option>
            <option value="country">Country</option>
          </select>
          {groupBy !== "none" && (
            <button
              onClick={() => handleGroupChange("none")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-warm-700/30 bg-warm-900/50 text-warm-400 hover:bg-warm-800/50 hover:text-warm-200 focus:outline-none focus:ring-2 focus:ring-warm-600/20"
              title="Clear grouping"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-warm-700/30 bg-warm-800/50">
        <Table>
          <TableHeader>
            <TableRow className="border-warm-700/30 hover:bg-warm-800/50">
              {!isGrouped && (
                <TableHead
                  onClick={() => handleSort("createdAt")}
                  className="cursor-pointer select-none text-warm-300 hover:text-warm-100"
                >
                  Date & Time
                  <SortIcon field="createdAt" />
                </TableHead>
              )}
              {(groupBy === "none" || groupBy === "pathname") && (
                <TableHead
                  onClick={() => handleSort("pathname")}
                  className="cursor-pointer select-none text-warm-300 hover:text-warm-100"
                >
                  Page
                  <SortIcon field="pathname" />
                </TableHead>
              )}
              {(groupBy === "none" || groupBy === "city") && (
                <TableHead
                  onClick={() => handleSort("city")}
                  className="cursor-pointer select-none text-warm-300 hover:text-warm-100"
                >
                  City
                  <SortIcon field="city" />
                </TableHead>
              )}
              {(groupBy === "none" || groupBy === "country") && (
                <TableHead
                  onClick={() => handleSort("country")}
                  className="cursor-pointer select-none text-warm-300 hover:text-warm-100"
                >
                  Country
                  <SortIcon field="country" />
                </TableHead>
              )}
              {isGrouped && (
                <TableHead className="text-warm-300">Views</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.views.map((view) => (
              <TableRow
                key={view.id}
                className="border-warm-700/20 hover:bg-warm-700/20"
              >
                {!isGrouped && view.createdAt && (
                  <TableCell className="font-mono text-xs text-warm-300">
                    {new Date(view.createdAt).toLocaleString()}
                  </TableCell>
                )}
                {(groupBy === "none" || groupBy === "pathname") && (
                  <TableCell className="font-mono text-sm text-warm-200">
                    {view.pathname || "—"}
                  </TableCell>
                )}
                {(groupBy === "none" || groupBy === "city") && (
                  <TableCell className="text-sm text-warm-300">
                    {view.city || "—"}
                  </TableCell>
                )}
                {(groupBy === "none" || groupBy === "country") && (
                  <TableCell className="text-sm text-warm-300">
                    {view.country || "—"}
                  </TableCell>
                )}
                {isGrouped && (
                  <TableCell className="font-semibold text-warm-200">
                    {view.count.toLocaleString()}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-warm-500">
          Showing {page * pageSize + 1} -{" "}
          {Math.min((page + 1) * pageSize, data.total)} of {data.total}{" "}
          {isGrouped ? "groups" : "views"}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            variant="outline"
            size="sm"
            className="border-warm-700/30 bg-warm-800/50 text-warm-200 hover:bg-warm-700/50 hover:text-warm-100 disabled:opacity-30"
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage(page + 1)}
            disabled={!data.hasMore}
            variant="outline"
            size="sm"
            className="border-warm-700/30 bg-warm-800/50 text-warm-200 hover:bg-warm-700/50 hover:text-warm-100 disabled:opacity-30"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
