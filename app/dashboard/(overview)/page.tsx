'use client'; // Mark this layout as a client component
import Card from '@/app/ui/dashboard/cards';
import { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { fetchAgencyAnalytics } from '@/app/api/agency';
import { fetchCaregivers } from '@/app/api/caregivers';
import Caregiver from '@/app/ui/dashboard/caregivers';
import {
  BanknotesIcon,
  UserGroupIcon,
  InboxIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default async function Page() {
  const agencyId = localStorage.getItem('agencyId');
  const analyticsData = await fetchAgencyAnalytics(agencyId as string);
  const caregivers = await fetchCaregivers(agencyId as string);

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Caregivers"
          total={analyticsData.caregiversCount}
          rate="0.43%"
          levelUp
          icon={<UserGroupIcon className="h-6 w-6 text-blue-500" />}
        />
        <Card
          title="Facilities"
          total={analyticsData.facilitiesCount}
          rate="0.43%"
          levelUp
          icon={<InboxIcon className="h-6 w-6 text-green-500" />}
        />
        <Card
          title="Shifts"
          total={analyticsData.shiftsCount}
          rate="0.43%"
          levelUp
          icon={<ClockIcon className="h-6 w-6 text-red-500" />}
        />
        <Card
          title="Total Money"
          total={5000}
          rate="0.43%"
          levelUp
          icon={<BanknotesIcon className="h-6 w-6 text-yellow-500" />}
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Caregiver caregivers={caregivers} />
      </div>
    </main>
  );
}
