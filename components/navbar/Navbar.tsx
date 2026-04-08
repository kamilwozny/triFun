import { auth } from '@/app/auth';
import { getNotificationPreview } from '@/actions/notifications';
import { NavbarClient } from './NavbarClient';

export const Navbar = async () => {
  const session = await auth();

  let initialCount = 0;
  let initialItems: Awaited<
    ReturnType<typeof getNotificationPreview>
  >['items'] = [];

  if (session?.user?.id) {
    const preview = await getNotificationPreview(3);
    initialCount = preview.count;
    initialItems = preview.items;
  }

  return (
    <NavbarClient
      initialNotificationCount={initialCount}
      initialNotificationItems={initialItems}
    />
  );
};
