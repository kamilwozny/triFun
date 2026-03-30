'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export const revalidateTrainingsList = async () => {
  revalidatePath('/trainings');
};

export const revalidateTrainings = async () => {
  revalidatePath('/trainings');
  redirect('/trainings');
};

export const revalidateTraining = async (id: string) => {
  revalidatePath(`/trainings/${id}`);
  revalidateTag(`training-event-${id}`);
  revalidateTag(`training-list-${id}`);
};
