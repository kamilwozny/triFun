export default function CreateTrainingLoading() {
  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="skeleton h-6 w-48 mb-4 bg-neutral-200" />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4 mx-auto max-w-md">
          <div className="space-y-2">
            <div className="skeleton h-5 w-24 bg-neutral-200" />
            <div className="skeleton h-10 w-full bg-neutral-200" />
          </div>

          <div className="space-y-2">
            <div className="skeleton h-5 w-24 bg-neutral-200" />
            <div className="skeleton h-24 w-full bg-neutral-200" />
          </div>

          <div className="space-y-2">
            <div className="skeleton h-5 w-36 bg-neutral-200" />
            <div className="skeleton h-10 w-full bg-neutral-200" />
          </div>

          <div className="space-y-2">
            <div className="skeleton h-5 w-24 bg-neutral-200" />
            <div className="skeleton h-10 w-full bg-neutral-200" />
          </div>

          <div className="space-y-2">
            <div className="skeleton h-5 w-24 bg-neutral-200" />
            <div className="skeleton h-10 w-full bg-neutral-200" />
          </div>

          <div className="space-y-2">
            <div className="skeleton h-5 w-24 bg-neutral-200" />
            <div className="skeleton h-10 w-full bg-neutral-200" />
          </div>

          <div className="mt-4">
            <div className="skeleton h-10 w-full bg-neutral-200" />
          </div>
        </div>

        <div className="flex-1 min-h-[700px]">
          <div className="skeleton w-full h-[700px] bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
