import Link from "next/link";

export default function NotFound() {
  return (
    <div className="app-shell flex items-center justify-center p-4">
      <div className="card max-w-md text-center">
        <p className="eyebrow mb-3">404</p>
        <h2 className="mb-2 text-xl font-semibold text-white">Page not found</h2>
        <p className="mb-6 text-sm text-slate-400">
          The page you requested does not exist or may have been moved.
        </p>
        <Link href="/login" className="btn-primary">
          Return to sign in
        </Link>
      </div>
    </div>
  );
}
