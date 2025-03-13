'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IFormLoginInput } from '@/actions/auth';
import Link from 'next/link';
import { loginAuthSchema } from '@/actions/schemas';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

interface SignInFormProps {
  csrfToken: string;
}

export const SignInForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormLoginInput>({
    resolver: zodResolver(loginAuthSchema),
  });

  const onSubmit: SubmitHandler<IFormLoginInput> = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await signIn('credentials', {
        redirect: false,
        emailOrLogin: data.emailOrLogin,
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <form
          className="mx-auto flex flex-col justify-center items-center w-full border-[3px] bg-neutral border-secondary p-6 rounded-lg shadow-xl"
          onSubmit={handleSubmit(onSubmit)}
          aria-labelledby="signin-heading"
        >
          <h1
            id="signin-heading"
            className="text-primary font-bold text-2xl mb-4"
          >
            Sign In
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
            <label className="label" htmlFor="emailOrLogin">
              <span className="label-text text-primary">Email or nickname</span>
            </label>
            <input
              id="emailOrLogin"
              {...register('emailOrLogin')}
              type="text"
              className="input input-bordered w-full"
              aria-describedby="emailOrLogin-error"
              aria-invalid={errors.emailOrLogin ? 'true' : 'false'}
              disabled={isLoading}
            />
            {errors.emailOrLogin && (
              <p
                id="emailOrLogin-error"
                className="text-error text-sm mt-1"
                role="alert"
              >
                {errors.emailOrLogin.message}
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

          <div className="flex flex-col sm:flex-row gap-4 w-full mt-8">
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary flex-1"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Processing...
                </>
              ) : (
                'Sign in with Google'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              className="text-secondary hover:text-secondary-focus transition-colors"
              href="/signup"
            >
              Don&apos;t have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
