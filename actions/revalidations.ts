'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const revalidateTrainings = async () => {
  revalidatePath('/trainings');
  redirect('/trainings');
};

export const revalidateTraining = async (id: string) => {
  revalidatePath(`/trainings/${id}`);
};
