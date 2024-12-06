'use client'; // Mark this layout as a client component
import { Card } from '@/app/ui/dashboard/cards';
import { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { fetchAgencyAnalytics} from '@/app/api/agency';
import {fetchCaregivers} from '@/app/api/caregivers';
import Caregiver  from '@/app/ui/dashboard/caregivers';
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
          value={analyticsData.caregiversCount}
          type="collected"
        />
        <Card
          title="Facilities"
          value={analyticsData.facilitiesCount}
          type="pending"
        />
        <Card
          title="Total Shifts"
          value={analyticsData.shiftsCount}
          type="invoices"
        />
        <Card title="Total Money" value={5000} type="customers" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Caregiver caregivers={caregivers}/>
      </div>
    </main>
  );
}
