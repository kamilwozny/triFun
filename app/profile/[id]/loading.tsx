export default function UserProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6 animate-pulse">
      {/* Section 1 — Identity + Stats */}
      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar + bio */}
          <div className="flex gap-4 flex-1 min-w-0">
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-full bg-neutral-200" />
            </div>
            <div className="flex flex-col justify-center gap-2 min-w-0">
              <div className="skeleton h-7 w-40 bg-neutral-200" />
              <div className="skeleton h-4 w-56 bg-neutral-200" />
              <div className="flex items-center gap-1 mt-1">
                <div className="skeleton h-3.5 w-3.5 bg-neutral-200 rounded-full" />
                <div className="skeleton h-4 w-32 bg-neutral-200" />
              </div>
            </div>
          </div>

          {/* Desktop divider */}
          <div className="hidden lg:block w-px bg-base-300" />

          {/* ProfileStats skeleton */}
          <div className="lg:w-52 shrink-0 flex flex-col gap-3">
            <div className="skeleton h-4 w-28 bg-neutral-200" />
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton h-5 w-5 bg-neutral-200 rounded-full" />
                  <div className="skeleton h-4 w-16 bg-neutral-200" />
                  <div className="skeleton h-4 w-6 bg-neutral-200 ml-auto" />
                </div>
              ))}
            </div>
            <div className="divider my-1" />
            <div className="flex items-center justify-between">
              <div className="skeleton h-4 w-24 bg-neutral-200" />
              <div className="skeleton h-8 w-10 bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 — Activity Chart */}
      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6">
        <div className="skeleton h-4 w-28 bg-neutral-200 mb-4" />
        <div className="skeleton h-[220px] w-full bg-neutral-200 rounded-lg" />
      </div>

      {/* Section 3 — Reviews */}
      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6">
        <div className="space-y-4">
          <div className="skeleton h-24 w-full bg-neutral-200 rounded-xl" />
          <div className="skeleton h-10 w-full bg-neutral-200 rounded-xl" />
          {[1, 2].map((i) => (
            <div key={i} className="skeleton h-20 w-full bg-neutral-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
