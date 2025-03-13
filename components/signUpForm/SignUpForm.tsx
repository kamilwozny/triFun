'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IFormRegisterInput, registerUser } from '@/actions/auth';
import { registerAuthSchema } from '@/actions/schemas';
import { useState } from 'react';
import Link from 'next/link';

export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormRegisterInput>({
    resolver: zodResolver(registerAuthSchema),
  });

  const onSubmit: SubmitHandler<IFormRegisterInput> = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      await registerUser(data);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to register. Please try again.'
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-neutral border-[3px] border-secondary p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-primary font-bold text-2xl mb-4">
              Registration Successful!
            </h2>
            <p className="text-base-content mb-6">
              Your account has been created successfully.
            </p>
            <Link href="/signin" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <form
          className="mx-auto flex flex-col justify-center items-center w-full border-[3px] bg-neutral border-secondary p-6 rounded-lg shadow-xl"
          onSubmit={handleSubmit(onSubmit)}
          aria-labelledby="signup-heading"
        >
          <h1
            id="signup-heading"
            className="text-primary font-bold text-2xl mb-4"
          >
            Sign Up
          </h1>
          <div className="divider divider-secondary w-full"></div>

          {error && (
            <div
              role="alert"
              className="alert alert-error mb-4 w-full"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <div className="form-control w-full">
            <label className="label" htmlFor="email">
              <span className="label-text text-primary">Email</span>
            </label>
            <input
              id="email"
              {...register('email')}
              type="email"
              className="input input-bordered w-full"
              aria-describedby="email-error"
              aria-invalid={errors.email ? 'true' : 'false'}
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && (
              <p
                id="email-error"
                className="text-error text-sm mt-1"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-control w-full mt-4">
            <label className="label" htmlFor="username">
              <span className="label-text text-primary">Username</span>
            </label>
            <input
              id="username"
              {...register('username')}
              type="text"
              className="input input-bordered w-full"
              aria-describedby="username-error"
              aria-invalid={errors.username ? 'true' : 'false'}
              disabled={isLoading}
              autoComplete="username"
            />
            {errors.username && (
              <p
                id="username-error"
                className="text-error text-sm mt-1"
                role="alert"
              >
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="form-control w-full mt-4">
            <label className="label" htmlFor="password">
              <span className="label-text text-primary">Password</span>
            </label>
            <input
              id="password"
              type="password"
              className="input input-bordered w-full"
              {...register('password')}
              aria-describedby="password-error"
              aria-invalid={errors.password ? 'true' : 'false'}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.password && (
              <p
                id="password-error"
                className="text-error text-sm mt-1"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="w-full mt-8">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Creating account...
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              className="text-secondary hover:text-secondary-focus transition-colors"
              href="/signin"
            >
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
