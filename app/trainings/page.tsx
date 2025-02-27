import { getAllTrainingEvents } from '@/helpers/events';
import { NewTrainings } from '@/components/trainings/NewTrainings';

export default async function TrainingsPage() {
  const trainings = await getAllTrainingEvents();

  return <NewTrainings trainings={trainings} />;
}
