import { auth } from '@/app/auth';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/signin');
  }
  redirect(`/profile/${session.user.id}`);
}
