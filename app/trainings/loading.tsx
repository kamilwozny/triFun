import { Separator } from '@/components/ui/separator';

export default function TrainingsLoading() {
  return (
    <div className="flex flex-col items-center gap-4 p-4 lg:p-8">
      {/* Mobile layout */}
      <div className="lg:hidden w-full space-y-3">
        {/* Search card */}
        <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 p-4 space-y-2 animate-pulse">
          <div className="skeleton h-9 w-full bg-neutral-200" />
          <div className="flex gap-2">
            <div className="skeleton h-9 flex-1 bg-neutral-200" />
            <div className="skeleton h-9 w-20 bg-neutral-200 shrink-0" />
          </div>
        </div>

        {/* Toggle pill */}
        <div className="flex gap-1 p-1 bg-base-200 rounded-2xl animate-pulse">
          <div className="skeleton flex-1 h-9 bg-neutral-200 rounded-xl" />
          <div className="skeleton flex-1 h-9 bg-neutral-200 rounded-xl" />
        </div>

        {/* Content pane */}
        <div className="h-[70vh] rounded-2xl bg-neutral-200 animate-pulse" />
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex flex-row items-start justify-center max-w-full gap-8 w-full">
        {/* Filters sidebar */}
        <div className="w-1/6 xl:w-1/5">
          <div className="rounded-xl bg-base-100 p-6 space-y-6 animate-pulse">
            <div className="skeleton h-8 w-24 bg-neutral-200" />
            <Separator />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton h-5 w-5 rounded bg-neutral-200" />
                  <div className="skeleton h-5 w-28 bg-neutral-200" />
                </div>
              ))}
            </div>
            <Separator />
            <div>
              <div className="skeleton h-5 w-24 mb-3 bg-neutral-200" />
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-8 w-20 rounded bg-neutral-200" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Event list */}
        <div className="w-3/6 xl:w-2/5">
          <div className="h-[70vh] rounded-xl bg-base-100 p-4 space-y-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white shadow-xl rounded-xl p-4 lg:p-6 animate-pulse"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="skeleton h-7 w-44 mb-2 bg-neutral-200" />
                    <div className="flex items-center gap-2">
                      <div className="skeleton h-4 w-4 rounded-full bg-neutral-200" />
                      <div className="skeleton h-4 w-32 bg-neutral-200" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="skeleton h-4 w-24 rounded-full bg-neutral-200" />
                    <div className="skeleton h-5 w-20 rounded-full bg-neutral-200" />
                  </div>
                </div>
                <div className="flex gap-2">
                  {[1, 2].map((j) => (
                    <div
                      key={j}
                      className="skeleton h-14 w-40 rounded-lg bg-neutral-200"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="w-2/6 xl:w-2/5 sticky top-0">
          <div className="skeleton rounded-xl bg-neutral-200 animate-pulse h-[70vh] w-full" />
        </div>
      </div>
    </div>
  );
}
