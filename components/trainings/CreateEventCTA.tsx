import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export function CreateEventCTA() {
  const { t } = useTranslation();
  return (
    <div className="mt-8 bg-white text-center rounded-xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-black mb-4">{t('createEvent')}</h2>
      <p className="text-black/50 mb-8">{t('createEventDescription')}</p>
      <Link
        href="trainings/create"
        className="bg-foreground text-white text-lg font-bold p-4 px-6 rounded-md btn-lg"
      >
        {t('btnCreateEvent')}
      </Link>
    </div>
  );
}
