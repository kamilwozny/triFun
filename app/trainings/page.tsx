import { getTrainingEvents } from '@/actions/trainingEvents';
import { TrainingEventsProvider } from '@/providers/TrainingEventsProvider';
import NewTrainings from '@/components/trainings/NewTrainings';

type SearchParams = {
  search?: string;
  location?: string;
  radius?: string;
  categorySport?: string;
};

export default async function TrainingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { search, location, radius, categorySport } = await searchParams;

  const events = await getTrainingEvents({ search, location, categorySport });

  return (
    <TrainingEventsProvider initialEvents={events}>
      <NewTrainings
        initialSearch={search ?? ''}
        initialLocation={location ?? ''}
        initialRadius={radius ?? '0'}
      />
    </TrainingEventsProvider>
  );
}
