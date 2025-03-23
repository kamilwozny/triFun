import { getTrainingEvents } from '@/actions/trainingEvents';
import dynamic from 'next/dynamic';
import { auth } from '@/app/auth';
import { redirect } from 'next/navigation';
import { TrainingEventsProvider } from '@/providers/TrainingEventsProvider';

export default async function TrainingsPage() {
  const events = await getTrainingEvents();

  const NewTrainings = dynamic(
    () => import('@/components/trainings/NewTrainings'),
    {
      ssr: false,
    }
  );

  return (
    <TrainingEventsProvider initialEvents={events}>
      <NewTrainings />
    </TrainingEventsProvider>
  );
}
