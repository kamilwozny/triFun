export default function NotificationsLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
      {/* Page title */}
      <div className="skeleton h-8 w-36 bg-neutral-200 mb-6" />

      <div className="space-y-6">
        {/* Unread section */}
        <section>
          <div className="skeleton h-4 w-16 bg-neutral-200 mb-2 mx-1" />
          <ul className="rounded-xl border border-border overflow-hidden divide-y divide-border">
            {[1, 2].map((i) => (
              <li key={i}>
                <div className="flex items-start gap-3 px-4 py-4 bg-accent/30">
                  <div className="shrink-0 mt-0.5">
                    <div className="skeleton w-10 h-10 rounded-full bg-neutral-200" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="skeleton h-4 w-full bg-neutral-200" />
                    <div className="skeleton h-3 w-24 bg-neutral-200" />
                  </div>
                  <div className="skeleton shrink-0 mt-2 w-2 h-2 rounded-full bg-blue-200" />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Earlier / Read section */}
        <section>
          <div className="skeleton h-4 w-16 bg-neutral-200 mb-2 mx-1" />
          <ul className="rounded-xl border border-border overflow-hidden divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <div className="flex items-start gap-3 px-4 py-4">
                  <div className="shrink-0 mt-0.5">
                    <div className="skeleton w-10 h-10 rounded-full bg-neutral-200" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="skeleton h-4 w-4/5 bg-neutral-200" />
                    <div className="skeleton h-3 w-24 bg-neutral-200" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
