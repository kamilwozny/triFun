export default function SettingsLoading() {
  return (
    <div className="max-w-2xl mx-auto p-4 lg:p-6 space-y-6 animate-pulse">
      {/* Page title */}
      <div className="skeleton h-8 w-24 bg-neutral-200" />

      {/* Card 1 — Profile */}
      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6">
        {/* "PROFILE" label */}
        <div className="skeleton h-4 w-16 bg-neutral-200 mb-4" />

        {/* Avatar + name/email row */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-base-300">
          <div className="skeleton w-16 h-16 rounded-full bg-neutral-200 shrink-0" />
          <div className="space-y-2">
            <div className="skeleton h-5 w-32 bg-neutral-200" />
            <div className="skeleton h-4 w-48 bg-neutral-200" />
          </div>
        </div>

        {/* EditableField rows: name, bio, location */}
        <div className="divide-y divide-base-200">
          <div className="py-3">
            <div className="skeleton h-3 w-24 bg-neutral-200 mb-2" />
            <div className="skeleton h-10 w-full bg-neutral-200" />
          </div>
          <div className="py-3">
            <div className="skeleton h-3 w-8 bg-neutral-200 mb-2" />
            <div className="skeleton h-20 w-full bg-neutral-200" />
          </div>
          <div className="py-3">
            <div className="skeleton h-3 w-20 bg-neutral-200 mb-2" />
            <div className="skeleton h-10 w-full bg-neutral-200" />
          </div>
        </div>
      </div>

      {/* Card 2 — Account */}
      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6">
        {/* "ACCOUNT" label */}
        <div className="skeleton h-4 w-20 bg-neutral-200 mb-4" />

        {/* Locked email field */}
        <div className="py-3">
          <div className="skeleton h-3 w-10 bg-neutral-200 mb-2" />
          <div className="flex items-center gap-2">
            <div className="skeleton h-3.5 w-3.5 bg-neutral-200 rounded shrink-0" />
            <div className="skeleton h-4 w-48 bg-neutral-200" />
          </div>
          <div className="skeleton h-3 w-40 bg-neutral-200 mt-2" />
        </div>
      </div>
    </div>
  );
}
