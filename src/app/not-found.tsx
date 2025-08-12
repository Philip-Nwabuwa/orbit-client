import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-6 text-center">
      <div className="max-w-md">
        <p className="text-sm font-semibold text-gray-600">404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
          Page not found
        </h1>
        <p className="mt-2 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Go home
        </Link>
        <Link
          href="/w/yrgGdg234j"
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Go to workspace
        </Link>
      </div>
    </div>
  );
}
