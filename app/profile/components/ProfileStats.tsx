'use client';

import { ProfileStatsResult } from '@/actions/profileStats';
import { FaBicycle, FaRunning, FaSwimmer } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface ProfileStatsProps {
  stats: ProfileStatsResult;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider">
        {t('lastFourWeeks')}
      </h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <FaBicycle className="text-green-500 h-5 w-5 shrink-0" />
          <span className="text-sm text-base-content/80">{t('bike')}</span>
          <span className="ml-auto font-semibold">{stats.bySport.Bike}</span>
        </div>
        <div className="flex items-center gap-3">
          <FaRunning className="text-red-500 h-5 w-5 shrink-0" />
          <span className="text-sm text-base-content/80">{t('run')}</span>
          <span className="ml-auto font-semibold">{stats.bySport.Run}</span>
        </div>
        <div className="flex items-center gap-3">
          <FaSwimmer className="text-blue-500 h-5 w-5 shrink-0" />
          <span className="text-sm text-base-content/80">{t('swim')}</span>
          <span className="ml-auto font-semibold">{stats.bySport.Swim}</span>
        </div>
      </div>
      <div className="divider my-1" />
      <div className="flex items-center justify-between">
        <span className="text-sm text-base-content/60">
          {t('totalActivities')}
        </span>
        <span className="text-2xl font-bold">{stats.total}</span>
      </div>
    </div>
  );
}
