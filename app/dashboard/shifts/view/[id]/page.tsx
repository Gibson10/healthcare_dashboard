'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // For fetching route params
import { fetchShiftById } from '../../../../api/shifts';

import dynamic from 'next/dynamic'; // Dynamically import Google Maps
import Image from 'next/image';

export default function ViewShift() {
  const { id } = useParams(); // Get shift ID from the route
  const [shift, setShift] = useState<any>(null); // Shift details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamically load the Google Map component
  const GoogleMap = dynamic(() => import('../../../../ui/google/GoogleMap'), {
    ssr: false,
  });

  useEffect(() => {
    const getShiftDetails = async () => {
      try {
        const shiftData = await fetchShiftById(id as string); // Fetch shift details
        if (typeof shiftData.facilityId.location.latitude === 'string') {
          shiftData.facilityId.location.latitude = parseFloat(
            shiftData.facilityId.location.latitude,
          );
        }

        if (typeof shiftData.facilityId.location.longitude === 'string') {
          shiftData.facilityId.location.longitude = parseFloat(
            shiftData.facilityId.location.longitude,
          );
        }

        setShift(shiftData);
      } catch (err) {
        setError('Error fetching shift details.');
      } finally {
        setLoading(false);
      }
    };

    getShiftDetails();
  }, [id]);

  if (loading) return <p>Loading shift details...</p>;
  if (error || !shift) return <p>{error || 'No shift details found.'}</p>;
  console.log('shift', shift);
  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-4 text-3xl font-semibold">{shift.title}</h2>

      {/* Facility Image */}
      {shift.facilityId.picture && (
        <div className="mb-6">
          <Image
            src={shift.facilityId.picture}
            alt={`${shift.facilityId.name} picture`}
            width={600}
            height={400}
            className="rounded-lg object-cover"
          />
        </div>
      )}

      {/* Shift Details */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold">Shift Details</h3>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>
              <strong>Facility:</strong> {shift.facilityId.name}
            </li>
            <li>
              <strong>Location:</strong> {shift.facilityId.textLocation}
            </li>
            <li>
              <strong>Start Time:</strong>{' '}
              {new Date(shift.startTime).toLocaleString()}
            </li>
            <li>
              <strong>End Time:</strong>{' '}
              {new Date(shift.endTime).toLocaleString()}
            </li>
            <li>
              <strong>Date:</strong> {new Date(shift.date).toLocaleDateString()}
            </li>
            <li>
              <strong>Status:</strong> {shift.status}
            </li>
            <li>
              <strong>Caregivers Needed:</strong> {shift.caregiversNeeded}
            </li>
            <li>
              <strong>Nurse Types:</strong>{' '}
              {shift.nurseType.map((type: string) => (
                <span
                  key={type}
                  className="mr-2 rounded bg-blue-200 px-2 py-1 text-xs font-medium text-blue-800"
                >
                  {type}
                </span>
              ))}
            </li>
            <li>
              <strong>Pay Rates:</strong>{' '}
              {shift.basePriceByNurseType.map(
                (entry: { nurseType: string; payRate: number }) => (
                  <div key={entry.nurseType}>
                    {entry.nurseType}: ${entry.payRate.toFixed(2)}
                  </div>
                ),
              )}
            </li>
          </ul>
        </div>

        {/* Location Map */}
        <div>
          <h3 className="text-xl font-semibold">Shift Location</h3>
          <div className="mt-4 h-80 w-full rounded-lg shadow-md">
            <GoogleMap
              latitude={shift.facilityId.location.latitude}
              longitude={shift.facilityId.location.longitude}
            />
          </div>
        </div>
      </div>

      {/* Assigned Caregivers */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Assigned Caregivers</h3>
        {shift.assignedCaregivers.length === 0 ? (
          <p>No caregivers assigned to this shift.</p>
        ) : (
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            {shift.assignedCaregivers.map((caregiver: any) => (
              <li key={caregiver._id}>{caregiver.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Cancelled Caregivers */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Cancelled Caregivers</h3>
        {shift.cancelledCaregivers.length === 0 ? (
          <p>No caregivers cancelled this shift.</p>
        ) : (
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            {shift.cancelledCaregivers.map((caregiver: string) => (
              <li key={caregiver}>{caregiver}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
