'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { loginAuthSchema } from '@/actions/schemas';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export interface IFormLoginInput {
  email: string;
  password: string;
}

export const SignInForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<IFormLoginInput>({
    resolver: zodResolver(loginAuthSchema),
  });

  const onSubmit: SubmitHandler<IFormLoginInput> = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await signIn('credentials', {
        redirect: false,
        emailn: data.email,
        password: data.password,
        callbackUrl: '/',
      });
      if (result?.error) {
        setError('Invalid credentials. Please try again.');
        console.error(result.error);
      } else {
        window.location.href = result?.url || '/';
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn('google', { callbackUrl: '/' });
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
    }
  };

  const handleStravaSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn('strava', { callbackUrl: '/' });
    } catch (err) {
      setError('Failed to sign in with Strava. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center bg-background">
      <div className="border p-16 bg-white">
        <h1 className="mb-8 text-2xl font-bold text-center">Log In</h1>
        <Button
          className="shadow-sm shadow-foreground bg-white text-lg font-semibold p-4 w-full text-foreground mb-4 hover:bg-background"
          onClick={handleGoogleSignIn}
        >
          Sign In With Google
        </Button>
        <Button
          className="shadow-sm shadow-foreground bg-white text-lg font-semibold p-4 w-full text-foreground mb-4 hover:bg-background"
          onClick={handleStravaSignIn}
        >
          <Image
            src="/assets/strava/btn_strava_connect_with_white.svg"
            width={150}
            height={20}
            alt="strava login"
          />
        </Button>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Username</FormLabel>
                  <FormControl>
                    <Input
                      className="p-4 text-black w-80 focus-visible:ring-foreground"
                      placeholder="johndoe@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="p-4 text-black w-80 focus-visible:ring-foreground"
                      placeholder="secret-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="bg-foreground text-lg font-semibold p-4 w-full hover:bg-card-foreground"
              type="submit"
            >
              Submit
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link
              className="text-black hover:text-foreground transition-colors"
              href="/signup"
            >
              Don&apos;t have an account?
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};
