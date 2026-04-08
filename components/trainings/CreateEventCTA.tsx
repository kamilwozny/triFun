import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export function CreateEventCTA() {
  const { t } = useTranslation();
  return (
    <div className="bg-white text-center rounded-xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-black mb-3">{t('createEvent')}</h2>
      <p className="text-black/50 text-sm mb-6">{t('createEventDescription')}</p>
      <Link
        href="/trainings/create"
        className="inline-block bg-foreground hover:bg-card-foreground text-white font-bold py-3 px-5 rounded-md"
      >
        {t('btnCreateEvent')}
      </Link>
    </div>
  );
}
