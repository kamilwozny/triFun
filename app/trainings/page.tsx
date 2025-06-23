import { getTrainingEvents } from '@/actions/trainingEvents';
import dynamic from 'next/dynamic';
import { TrainingEventsProvider } from '@/providers/TrainingEventsProvider';

export default async function TrainingsPage() {
  const events = await getTrainingEvents();

  const NewTrainings = dynamic(
    () => import('@/components/trainings/NewTrainings'),
    {
      ssr: true,
    }
  );

  return (
    <TrainingEventsProvider initialEvents={events}>
      <NewTrainings />
    </TrainingEventsProvider>
  );
}
