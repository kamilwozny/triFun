export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="text-neutral-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
