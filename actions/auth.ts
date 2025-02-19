'use server';
import { signIn, signUp } from '../helpers/auth';
import { cookies } from 'next/headers';
import { SECRET_AUTH, COOKIE_NAME } from '@/helpers/contants';
import { redirect } from 'next/navigation';
import { loginAuthSchema, registerAuthSchema } from './schemas';

export interface IFormLoginInput {
  emailOrLogin: string;
  password: string;
}

export interface IFormRegisterInput {
  username: string;
  email: string;
  password: string;
}

export const registerUser = async (formData: IFormRegisterInput) => {
  const authData = registerAuthSchema.parse(formData);

  try {
    const { token } = await signUp(authData);
    cookies().set(SECRET_AUTH, token);
  } catch (error) {
    console.error(error);
  }
  redirect('/dashboard');
};

export const signInUser = async (formData: IFormLoginInput) => {
  const authData = loginAuthSchema.parse(formData);

  try {
    const { token } = await signIn(authData);
    cookies().set(COOKIE_NAME, token);
  } catch (error) {
    console.error(error);
  }
  redirect('/dashboard');
};

export const signOut = async () => {
  cookies().delete(SECRET_AUTH);
  redirect('/signin');
};
