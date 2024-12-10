'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Get facility ID from the route
import {
  fetchFacilityById,
  Facility,
  fetchFacilities,
} from '../../../../api/facilities'; // Your fetch function
import { fetchShiftsByFacility, Shift } from '../../../../api/shifts';

import ShiftTable from '../../../../ui/shifts/ShiftsTable';
import dynamic from 'next/dynamic'; // Dynamically import Google Maps
import Image from 'next/image';

export default function ViewFacility() {
  const { id } = useParams(); // Get facility ID from the route
  const [facility, setFacility] = useState<Facility | null>(null);
  const [facilities, setFacilities] = useState<any[]>([]); // State to store fetched facilities
  const [shifts, setShifts] = useState<Shift[]>([]); // State to hold shifts
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [isShiftDetailsModalOpen, setIsShiftDetailsModalOpen] = useState(false);
  const [shiftDetails, setShiftDetails] = useState({
    shiftTitle: '',
    assignedCaregivers: [] as any[],
    canceledCaregivers: [] as any[],
  });
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const handleEditShift = (shift: any) => {
    console.log('Edit shift:', shift);
    // Add your edit logic here
  };

  const openDetailsModal = (shift: Shift) => {
    console.log('shift', shift);
    setShiftDetails({
      shiftTitle: shift.title,
      assignedCaregivers: shift.assignedCaregivers,
      canceledCaregivers: shift.cancelledCaregivers,
    });
    setIsShiftDetailsModalOpen(true);
  };

  const openEditModal = (shift: Shift) => {
    setSelectedShift(shift);
    setEditModalIsOpen(true);
  };
  const closeEditModal = () => setEditModalIsOpen(false);

  const handleViewShiftDetails = (shift: any) => {
    console.log('View shift details:', shift);
    // Add your view logic here
  };
  // Dynamically load the Google Map component
  const GoogleMap = dynamic(() => import('../../../../ui/google/GoogleMap'), {
    ssr: false,
  });

  useEffect(() => {
    const getFacilityAndShifts = async () => {
      try {
        const facilityData = await fetchFacilityById(id as string); // Fetch facility details
        facilityData.location.latitude = parseFloat(
          facilityData.location.latitude,
        );
        facilityData.location.longitude = parseFloat(
          facilityData.location.longitude,
        );

        // Ensure the values are valid numbers
        if (
          isNaN(facilityData.location.latitude) ||
          isNaN(facilityData.location.longitude)
        ) {
          throw new Error(
            'Invalid latitude or longitude values received from the API.',
          );
        }
        setFacility(facilityData);

        const agencyId = localStorage.getItem('agencyId');

        if (!agencyId) {
          console.error('No agencyId found');
          return;
        }
        const data = await fetchFacilities(agencyId); // Fetch facilities
        setFacilities(data); // Set the fetched facilities in state

        const shiftsData = await fetchShiftsByFacility(id as string); // Fetch shifts for the facility
        setShifts(shiftsData);
      } catch (err) {
        setError('Error fetching facility or shifts details');
      } finally {
        setLoading(false);
      }
    };

    getFacilityAndShifts();
  }, [id]);

  if (loading) {
    return <p>Loading facility details...</p>;
  }

  if (error || !facility) {
    return <p>{error || 'No facility details found'}</p>;
  }
  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-4 text-3xl font-semibold">{facility.name}</h2>

      {/* Facility Image and Map Side-by-Side */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Facility Image */}
        <div>
          {facility.picture && (
            <Image
              src={facility.picture}
              alt={`${facility.name} picture`}
              width={600}
              height={400}
              className="w-full rounded-lg object-cover"
            />
          )}
        </div>

        {/* Facility Map */}
        <div>
          <div className=" h-80 w-full rounded-lg shadow-md">
            <GoogleMap
              latitude={facility.location.latitude}
              longitude={facility.location.longitude}
            />
          </div>
        </div>
      </div>

      {/* Facility Details */}
      <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="mt-5 text-xl font-semibold">Facility Details</h3>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>
              <strong>Address:</strong> {facility.textLocation}
            </li>
            <li>
              <strong>Phone:</strong> {facility.phone}
            </li>
            <li>
              <strong>Email:</strong> {facility.email}
            </li>
            {facility.buildingName && (
              <li>
                <strong>Building:</strong> {facility.buildingName}
              </li>
            )}
            {facility.floor && (
              <li>
                <strong>Floor:</strong> {facility.floor}
              </li>
            )}
            {facility.description && (
              <li>
                <strong>Description:</strong> {facility.description}
              </li>
            )}
          </ul>
        </div>
      </div>

      <h3 className="mt-5 text-xl font-semibold">Shifts</h3>

      {/* Facility Shifts Table */}
      <ShiftTable
        shifts={shifts}
        facilities={facilities}
        onReload={() => window.location.reload()}
      />
    </div>
  );
}
