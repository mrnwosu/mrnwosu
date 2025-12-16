export default function Loading() {
  return (
    <main className="min-h-screen bg-warm-950">
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <span
              className="h-3 w-3 animate-bounce rounded-full bg-warm-400"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="h-3 w-3 animate-bounce rounded-full bg-warm-400"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="h-3 w-3 animate-bounce rounded-full bg-warm-400"
              style={{ animationDelay: "300ms" }}
            />
          </div>
          <p className="text-base text-warm-300 sm:text-lg">Loading...</p>
        </div>
      </div>
    </main>
  );
}
