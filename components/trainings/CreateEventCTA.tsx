import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export function CreateEventCTA() {
  const { t } = useTranslation();
  return (
    <div className="mt-8 bg-neutral text-center rounded-xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-white mb-4">{t('createEvent')}</h2>
      <p className="text-white/90 mb-6">{t('createEventDescription')}</p>
      <Link href="trainings/create" className="btn btn-primary btn-lg">
        {t('btnCreateEvent')}
      </Link>
    </div>
  );
}
