'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '@/app/auth';
import { db } from '@/db/db';
import { users, trainingEvents, eventAttendees } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import toast from 'react-hot-toast';
import { FaUser, FaMapMarkerAlt, FaPen } from 'react-icons/fa';
import Image from 'next/image';

interface ProfileFormData {
  name: string;
  email: string;
  bio: string;
  location: string;
  avatar: FileList;
}

interface ProfileStats {
  hostedEvents: number;
  attendedEvents: number;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    hostedEvents: 0,
    attendedEvents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>();

  const avatarFile = watch('avatar');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await auth();
        if (!session?.user?.id) return;

        const [userData] = await db
          .select()
          .from(users)
          .where(eq(users.id, session.user.id));

        if (userData) {
          setValue('name', userData.name || '');
          setValue('email', userData.email || '');
          setValue('bio', userData.bio || '');
          setValue('location', userData.location || '');
          setAvatarPreview(userData.customAvatar || userData.image || null);
        }

        // Fetch user stats
        const hostedEvents = await db
          .select({ count: sql<number>`count(*)` })
          .from(trainingEvents)
          .where(eq(trainingEvents.createdBy, session.user.id));

        const attendedEvents = await db
          .select({ count: sql<number>`count(*)` })
          .from(eventAttendees)
          .where(eq(eventAttendees.attendeeId, session.user.id));

        setStats({
          hostedEvents: hostedEvents[0]?.count || 0,
          attendedEvents: attendedEvents[0]?.count || 0,
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [setValue]);

  useEffect(() => {
    if (avatarFile?.[0]) {
      const file = avatarFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [avatarFile]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const session = await auth();
      if (!session?.user?.id) {
        toast.error('You must be logged in to update your profile');
        return;
      }

      let avatarUrl = null;
      if (data.avatar?.[0]) {
        const formData = new FormData();
        formData.append('file', data.avatar[0]);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        avatarUrl = result.url;
      }

      await db
        .update(users)
        .set({
          name: data.name,
          bio: data.bio,
          location: data.location,
          customAvatar: avatarUrl || undefined,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(users.id, session.user.id));

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-ghost btn-sm"
          >
            <FaPen className="mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="avatar placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-32">
                      <FaUser className="w-16 h-16" />
                    </div>
                  </div>
                )}
                {isEditing && (
                  <div className="mt-4">
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered w-full max-w-xs"
                      {...register('avatar')}
                    />
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="stat bg-primary/10 rounded-box p-4">
                  <div className="stat-title">Hosted Events</div>
                  <div className="stat-value text-primary">
                    {stats.hostedEvents}
                  </div>
                </div>
                <div className="stat bg-secondary/10 rounded-box p-4">
                  <div className="stat-title">Attended Events</div>
                  <div className="stat-value text-secondary">
                    {stats.attendedEvents}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  disabled={!isEditing}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <span className="text-error text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  disabled
                  {...register('email')}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  disabled={!isEditing}
                  {...register('bio')}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute top-3 left-3 text-neutral-500" />
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    disabled={!isEditing}
                    {...register('location')}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end mt-6">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
