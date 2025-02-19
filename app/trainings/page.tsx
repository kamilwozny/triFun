import { getAllTrainingEvents } from '@/helpers/events';
import { Trainings } from '@/components/trainings/Trainings';

export default async function TrainingsPage() {
  const trainings = await getAllTrainingEvents();

  return <Trainings trainings={trainings} />;
}
