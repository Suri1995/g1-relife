export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-sage border-t-honey" />
        <p className="font-display text-sm tracking-wide text-evergreen/70">
          Loading your wellness journey…
        </p>
      </div>
    </div>
  );
}
