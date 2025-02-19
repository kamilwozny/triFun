'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IFormRegisterInput, registerUser } from '@/actions/auth';
import { registerAuthSchema } from '@/actions/schemas';

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormRegisterInput>({
    resolver: zodResolver(registerAuthSchema),
  });
  const onSubmit: SubmitHandler<IFormRegisterInput> = (data) =>
    registerUser(data);

  return (
    <form
      className=" mx-auto flex flex-col justify-center items-center w-[400px] border-[3px] bg-neutral border-secondary p-4 rounded-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-primary font-bold text-xl">Sign Up</h1>
      <div className="divider divider-secondary"></div>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text text-primary">Enter email</span>
        </div>
        <input
          {...register('email')}
          type="text"
          className="input input-bordered w-full max-w-xs"
        />
        <p>{errors.root?.message}</p>
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text text-primary">Enter username</span>
        </div>
        <input
          {...register('username')}
          type="text"
          className="input input-bordered w-full max-w-xs"
        />
        <p>{errors.root?.message}</p>
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
        <p>{errors.root?.message}</p>
      </label>
      <button type="submit" className="btn btn-outline btn-primary mt-8 m-4">
        Register
      </button>
    </form>
  );
};
