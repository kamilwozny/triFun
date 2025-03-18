import NewTrainings from '@/components/trainings/NewTrainings';
import { auth } from '@/app/auth';
import { redirect } from 'next/navigation';

export default async function TrainingsPage() {
  const session = await auth();
  if (!session?.user) return redirect('/signin');

  return <NewTrainings />;
}
