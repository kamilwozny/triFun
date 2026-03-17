import { getTrainingEvents } from '@/actions/trainingEvents';
import { TrainingEventsProvider } from '@/providers/TrainingEventsProvider';
import NewTrainings from '@/components/trainings/NewTrainings';

type PageProps = {
  searchParams: {
    search?: string;
    userEvents?: boolean;
    joinedEvents?: boolean;
    pastEvents?: boolean;
    levels?: string[];
    location?: string;
    radius?: string;
    categorySport?: string;
  };
};

export default async function TrainingsPage({ searchParams }: PageProps) {
  const {
    search,
    categorySport,
    levels,
    location,
    radius,
    pastEvents,
    userEvents,
    joinedEvents,
  } = searchParams;
  const events = await getTrainingEvents({
    search,
    categorySport,
    levels,
    location,
    radius,
    pastEvents,
    userEvents,
    joinedEvents,
  });

  return (
    <TrainingEventsProvider initialEvents={events}>
      <NewTrainings />
    </TrainingEventsProvider>
  );
}
