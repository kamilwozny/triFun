export default function TrainingsLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 lg:px-8">
      {/* Filter buttons skeleton */}
      <div className="flex flex-wrap gap-4 justify-center">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skeleton w-24 h-10 rounded-full bg-neutral-200"
          />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-center max-w-full gap-8 w-full">
        {/* Events list skeleton */}
        <div className="w-full lg:w-1/2 xl:w-3/5">
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card bg-white shadow-xl rounded-xl p-6 animate-pulse"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-3">
                    <div className="skeleton h-8 w-64 bg-neutral-200" />
                    <div className="skeleton h-4 w-48 bg-neutral-200" />
                  </div>
                  <div className="space-y-2">
                    <div className="skeleton h-6 w-32 rounded-full bg-neutral-200" />
                    <div className="skeleton h-5 w-24 rounded-full bg-neutral-200" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 my-6">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="skeleton h-20 rounded-lg bg-neutral-200"
                    />
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <div className="skeleton h-12 w-32 bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map skeleton */}
        <div className="w-full lg:w-1/2 xl:w-2/5 sticky top-0">
          <div className="skeleton h-[700px] w-full rounded-xl bg-neutral-200" />
          <div className="mt-8 skeleton h-48 w-full rounded-xl bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
