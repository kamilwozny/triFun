'use client';

import dynamic from 'next/dynamic';

const RouteMap = dynamic(() => import('@/components/map/RouteMap'), { ssr: false });

export default RouteMap;
