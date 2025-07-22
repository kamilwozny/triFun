import Link from 'next/link';

export function CreateEventCTA() {
  return (
    <div className="mt-8 bg-neutral text-center rounded-xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-white mb-4">
        Create Your Own Event
      </h2>
      <p className="text-white/90 mb-6">
        Want to organize your own training? Set up your event and invite
        friends!
      </p>
      <Link href="trainings/create" className="btn btn-primary btn-lg">
        Start Creating
      </Link>
    </div>
  );
}