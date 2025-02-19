'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IFormLoginInput, signInUser } from '@/actions/auth';
import Link from 'next/link';
import { loginAuthSchema } from '@/actions/schemas';

export const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormLoginInput>({
    resolver: zodResolver(loginAuthSchema),
  });
  const onSubmit: SubmitHandler<IFormLoginInput> = async (data) => {
    console.log(data);
    await signInUser(data);
  };

  return (
    <form
      className=" mx-auto flex flex-col justify-center items-center w-[400px] border-[3px] bg-neutral border-secondary p-4 rounded-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-primary font-bold text-xl">Sign In</h1>
      <div className="divider divider-secondary"></div>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text text-primary">
            Enter email or nickname
          </span>
        </div>
        <input
          {...register('emailOrLogin')}
          type="text"
          className="input input-bordered w-full max-w-xs"
        />
        <p className="text-primary">{errors.emailOrLogin?.message}</p>
      </label>
      <label className="form-control w-full max-w-xs mt-4">
        <div className="label">
          <span className="label-text text-primary">Enter password</span>
        </div>
        <input
          type="password"
          className="input input-bordered w-full max-w-xs"
          {...register('password')}
        />
        <p className="text-primary">{errors.password?.message}</p>
      </label>
      <button type="submit" className="btn btn-outline btn-primary mt-8 m-4">
        Login
      </button>
      <Link className="text-secondary" href={'/signup'}>
        Don&apos;t have an account?
      </Link>
    </form>
  );
};
