import { Separator } from '@/components/ui/separator';

export default function TrainingsLoading() {
  return (
    <div className="flex gap-8 px-4 lg:px-8 mt-6">
      <div className="w-[20%] flex-shrink-0 bg-white rounded-xl shadow p-6 animate-pulse">
        <div className="skeleton h-8 w-32 mb-6 bg-neutral-200" />
        <Separator />
        <div className="mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-6 mb-4">
              <div className="skeleton h-5 w-5 rounded bg-neutral-200" />
              <div className="skeleton h-8 w-40 bg-neutral-200" />
            </div>
          ))}
        </div>
        <Separator />

        <div className="skeleton h-6 w-28 mt-6 mb-6 bg-neutral-200" />
        <div className="flex flex-col gap-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton h-8 w-20 rounded-sm bg-neutral-200"
            />
          ))}
        </div>
        <Separator />
        <div className="skeleton h-6 w-24 mb-2 bg-neutral-200 mt-8" />
        <div className="skeleton h-4 w-24 mb-2 bg-neutral-200 mt-8" />
        <div className="skeleton h-10 w-full mb-4 bg-neutral-200 mt-6" />
        <div className="skeleton h-4 w-full mb-2 bg-neutral-200 mt-4" />
        <div className="flex justify-between">
          <div className="skeleton h-4 w-12 bg-neutral-200" />
          <div className="skeleton h-4 w-12 bg-neutral-200" />
        </div>
      </div>

      <div className="flex-1 max-w-[40%] bg-white">
        <div className="flex flex-col gap-6 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white shadow-xl rounded-xl p-6 animate-pulse"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="skeleton h-12 w-40 mb-2 bg-neutral-200" />
                  <div className="flex items-center gap-2 mb-2">
                    <div className="skeleton h-4 w-5 bg-neutral-200 rounded-full" />
                    <div className="skeleton h-4 w-32 bg-neutral-200" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="skeleton h-4 w-24 rounded-full bg-neutral-200" />
                  <div className="skeleton h-5 w-28 rounded-full bg-neutral-200" />
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="skeleton h-14 w-32 rounded bg-neutral-200"
                  />
                ))}
              </div>
              <div className="flex justify-end">
                <div className="skeleton h-6 w-28 bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-[40%]">
        <div className="skeleton h-[80%] w-full rounded-xl bg-neutral-200" />
        <div className="skeleton h-40 w-full rounded-xl bg-neutral-200" />
      </div>
    </div>
  );
}
