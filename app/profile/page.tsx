import { auth } from '@/app/auth';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-primary text-white rounded-full w-16">
              <span className="text-2xl">
                {session.user.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">
              {session.user.name || 'Anonymous'}
            </h1>
            <p className="text-neutral-600">{session.user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
