"use client";

import { api } from "@utils/trpc-provider";
import { VisitorMap } from "./VisitorMap";
import { ViewsTable } from "./ViewsTable";
import "leaflet/dist/leaflet.css";

export function AnalyticsDashboard() {
  const { data: stats, isLoading: statsLoading } =
    api.analytics.getStats.useQuery();
  const { data: geoData, isLoading: geoLoading } =
    api.analytics.getGeographicData.useQuery();
  const { data: popularPages, isLoading: pagesLoading } =
    api.analytics.getPopularPages.useQuery({ limit: 5 });
  const { data: topCountries, isLoading: countriesLoading } =
    api.analytics.getTopCountries.useQuery({ limit: 5 });

  const isLoading =
    statsLoading || geoLoading || pagesLoading || countriesLoading;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl border border-warm-700/30 bg-warm-800/30"
            />
          ))}
        </div>
        <div className="h-[500px] rounded-xl border border-warm-700/30 bg-warm-800/30" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Total Views"
          value={stats?.totalViews ?? 0}
          subtitle={`Last ${stats?.days ?? 30} days: ${stats?.viewsSince ?? 0}`}
        />
        <StatCard
          title="Unique Visitors"
          value={stats?.uniqueVisitors ?? 0}
          subtitle="All time unique IPs"
        />
        <StatCard
          title="Cities"
          value={geoData?.length ?? 0}
          subtitle="Unique locations"
        />
      </div>

      {/* Page Views Table */}
      <div className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-warm-100">
          Page Views
        </h2>
        <ViewsTable />
      </div>

      {/* Visitor Map */}
      <div className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-warm-100">
          Visitor Locations
        </h2>
        {geoData && geoData.length > 0 ? (
          <VisitorMap locations={geoData} />
        ) : (
          <div className="flex h-[500px] items-center justify-center rounded-xl border border-warm-700/30 bg-warm-900/30 text-warm-500">
            No location data available yet
          </div>
        )}
      </div>

      {/* Popular Pages & Top Countries */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Popular Pages */}
        <div className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-warm-100">
            Popular Pages
          </h2>
          {popularPages && popularPages.length > 0 ? (
            <div className="space-y-3">
              {popularPages.map((page, index) => (
                <div
                  key={page.pathname}
                  className="flex items-center justify-between rounded-lg border border-warm-700/20 bg-warm-900/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warm-700/30 text-sm font-semibold text-warm-300">
                      {index + 1}
                    </div>
                    <div className="font-mono text-sm text-warm-200">
                      {page.pathname}
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-warm-400">
                    {page.views}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-warm-500">
              No page views yet
            </div>
          )}
        </div>

        {/* Top Countries */}
        <div className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-warm-100">
            Top Countries
          </h2>
          {topCountries && topCountries.length > 0 ? (
            <div className="space-y-3">
              {topCountries.map((country, index) => (
                <div
                  key={country.countryCode}
                  className="flex items-center justify-between rounded-lg border border-warm-700/20 bg-warm-900/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warm-700/30 text-sm font-semibold text-warm-300">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getFlagEmoji(country.countryCode)}
                      </span>
                      <span className="text-sm text-warm-200">
                        {country.country}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-warm-400">
                    {country.views}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-warm-500">
              No country data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-6">
      <h3 className="mb-2 text-sm font-medium text-warm-400">{title}</h3>
      <div className="mb-1 text-3xl font-bold text-warm-100">
        {value.toLocaleString()}
      </div>
      <p className="text-xs text-warm-500">{subtitle}</p>
    </div>
  );
}

function getFlagEmoji(countryCode: string | null): string {
  if (!countryCode || countryCode === "LOCAL") return "🌐";
  if (countryCode.length !== 2) return "🌐";

  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
