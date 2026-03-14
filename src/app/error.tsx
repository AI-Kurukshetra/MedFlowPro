"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="app-shell flex items-center justify-center p-4">
      <div className="card max-w-md text-center">
        <p className="eyebrow mb-3">Unexpected issue</p>
        <h2 className="mb-2 text-xl font-semibold text-white">Something went wrong</h2>
        <p className="mb-6 text-sm text-slate-400">
          {error.message || "An unexpected error occurred while loading this view."}
        </p>
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
      </div>
    </div>
  );
}
