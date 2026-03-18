export default function TrainingDetailsLoading() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="skeleton h-8 w-64 bg-neutral-200" />
            <div className="skeleton h-4 w-48 bg-neutral-200" />
            <div className="skeleton h-4 w-40 bg-neutral-200" />
          </div>
          <div className="skeleton h-6 w-24 rounded-full bg-neutral-200" />
        </div>
        <div className="skeleton h-20 w-full mt-4 bg-neutral-200" />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="skeleton h-6 w-6 bg-neutral-200" />
          <div className="skeleton h-6 w-32 bg-neutral-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-neutral-50 p-4 rounded-lg flex items-center gap-4"
            >
              <div className="skeleton h-8 w-8 bg-neutral-200" />
              <div className="space-y-2">
                <div className="skeleton h-5 w-20 bg-neutral-200" />
                <div className="skeleton h-4 w-24 bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="skeleton h-6 w-6 bg-neutral-200" />
            <div className="skeleton h-6 w-48 bg-neutral-200" />
          </div>
          <div className="skeleton h-10 w-32 bg-neutral-200" />
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="bg-neutral-100 rounded-l-lg">
                  <div className="skeleton h-4 w-24 bg-neutral-200" />
                </th>
                <th className="bg-neutral-100">
                  <div className="skeleton h-4 w-16 bg-neutral-200" />
                </th>
                <th className="bg-neutral-100 rounded-r-lg">
                  <div className="skeleton h-4 w-24 bg-neutral-200" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i}>
                  <td>
                    <div className="skeleton h-4 w-32 bg-neutral-200" />
                  </td>
                  <td>
                    <div className="skeleton h-4 w-20 bg-neutral-200" />
                  </td>
                  <td>
                    <div className="skeleton h-4 w-28 bg-neutral-200" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
