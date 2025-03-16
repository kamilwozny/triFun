'use client';

import { signUpForEvent } from '@/actions/attendeesEvents';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaUserPlus, FaUserFriends } from 'react-icons/fa';

interface EventActionButtonProps {
  eventId: string;
  isAttending: boolean;
}

export function EventActionButton({
  eventId,
  isAttending,
}: EventActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const result = await signUpForEvent(eventId);

      if (result.success) {
        toast.success('Successfully signed up for the event!');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to sign up');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to sign up for the event');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAttending) {
    return (
      <button
        className="btn btn-outline gap-2 hover:bg-primary"
        onClick={() => toast.success('Invite feature coming soon!')}
      >
        <FaUserFriends className="h-5 w-5" />
        Invite friends
      </button>
    );
  }

  return (
    <button
      onClick={handleSignUp}
      className="btn btn-primary gap-2"
      disabled={isLoading}
    >
      <FaUserPlus className="h-5 w-5" />
      {isLoading ? 'Signing up...' : 'Sign up'}
    </button>
  );
}
