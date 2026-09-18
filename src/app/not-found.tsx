import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <span className="font-display text-7xl text-sage">404</span>
      <h1 className="font-display text-3xl text-evergreen">
        This path doesn&apos;t lead anywhere yet
      </h1>
      <p className="max-w-md text-ink/70">
        The page you&apos;re looking for has moved or doesn&apos;t exist.
        Let&apos;s get you back to your wellness journey.
      </p>
      <Link
        href="/"
        className="rounded-full bg-evergreen px-6 py-3 text-sm font-medium text-cream transition hover:bg-evergreen-light"
      >
        Back to homepage
      </Link>
    </div>
  );
}
