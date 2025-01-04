'use client';

import { useState, useEffect } from 'react';
import { fetchFacilities } from '../../api/facilities';
import { fetchShifts, createShift, Shift } from '../../api/shifts';
import EditShiftModal from '../../ui/shifts/EditShifts';
import ViewShiftDetailsModal from '../../ui/shifts/ViewShiftModelDetails';
import { toast, ToastContainer } from 'react-toastify';
import ShiftsTable from '@/app/ui/shifts/ShiftsTable';

type NursePayRate = {
  nurseType: string;
  payRate: number;
};

type ShiftData = {
  title: string;
  facilityId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  caregiversNeeded: number;
  nurseType: string[];
  basePrice: number;
  basePriceByNurseType: NursePayRate[]; // Array of { nurseType, payRate }
};
export default function Page() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [activeTab, setActiveTab] = useState('open-shifts');
  const [shiftData, setShiftData] = useState<ShiftData>({
    title: '',
    facilityId: '',
    date: '',
    startTime: '',
    endTime: '',
    status: 'open',
    caregiversNeeded: 0,
    nurseType: [],
    basePrice: 0,
    basePriceByNurseType: [], // Array of { nurseType, payRate }
  });

  const [shiftDetails, setShiftDetails] = useState({
    shiftTitle: '',
    assignedCaregivers: [] as any[],
    canceledCaregivers: [] as any[],
  });
  const [isShiftDetailsModalOpen, setIsShiftDetailsModalOpen] = useState(false);

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  // Fetch facilities and shifts data on component mount
  useEffect(() => {
    const getFacilitiesAndShifts = async () => {
      const agencyId = localStorage.getItem('agencyId');
      if (!agencyId) {
        console.error('No agencyId found');
        return;
      }
      try {
        const facilitiesData = await fetchFacilities(agencyId);
        setFacilities(facilitiesData);
        const shiftsData = await fetchShifts(agencyId);
        console.log('shiftsData', shiftsData);
        setShifts(shiftsData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    getFacilitiesAndShifts();
  }, []);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Open shift details modal with specific shift data
  const openDetailsModal = (shift: Shift) => {
    console.log('shift', shift);
    setShiftDetails({
      shiftTitle: shift.title,
      assignedCaregivers: shift.assignedCaregivers,
      canceledCaregivers: shift.cancelledCaregivers,
    });
    setIsShiftDetailsModalOpen(true);
  };

  const handlePayRateChange = (nurseType: string, payRate: number) => {
    setShiftData((prevData) => {
      const updatedBasePriceByNurseType = [...prevData.basePriceByNurseType];
      const existingEntryIndex = updatedBasePriceByNurseType.findIndex(
        (entry) => entry.nurseType === nurseType,
      );

      if (existingEntryIndex >= 0) {
        // Update existing nurse type pay rate
        updatedBasePriceByNurseType[existingEntryIndex].payRate = payRate;
      } else {
        // Add new nurse type pay rate
        updatedBasePriceByNurseType.push({ nurseType, payRate });
      }

      return {
        ...prevData,
        basePriceByNurseType: updatedBasePriceByNurseType,
      };
    });
  };

  // Handle input changes in shift form
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setShiftData({
      ...shiftData,
      [name]: value,
    });
  };

  // Handle multi-select change for nurseType
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setShiftData((prevState) => ({
      ...prevState,
      nurseType: selectedOptions,
    }));
  };

  // Submit shift creation form
  const handleSubmitShift = async () => {
    try {
      const combinedStartTime = new Date(
        `${shiftData.date}T${shiftData.startTime}`,
      );
      const combinedEndTime = new Date(
        `${shiftData.date}T${shiftData.endTime}`,
      );

      const shiftToSubmit = {
        ...shiftData,
        date: new Date(shiftData.date), // Convert date to Date object
        startTime: combinedStartTime,
        endTime: combinedEndTime,
        caregiversNeeded: Number(shiftData.caregiversNeeded),
        basePriceByNurseType: shiftData.basePriceByNurseType.filter(
          (entry) => entry.payRate > 0,
        ),
      };
      console.log('shiftToSubmit', shiftToSubmit);
      await createShift(shiftToSubmit);
      toast.success('Shift Created Successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      closeModal();
      window.location.reload();
    } catch (err) {
      console.error('Error creating shift:', err);
    }
  };

  const openEditModal = (shift: Shift) => {
    setSelectedShift(shift);
    setEditModalIsOpen(true);
  };
  const closeEditModal = () => setEditModalIsOpen(false);

  // Filter shifts based on the active tab
  const renderShiftsTable = () => {
    let filteredShifts;
    switch (activeTab) {
      case 'open-shifts':
        filteredShifts = shifts.filter((shift) => shift.status === 'open');
        break;
      case 'active-shifts':
        filteredShifts = shifts.filter((shift) => shift.status === 'active');
        break;
      case 'canceled-shifts':
        filteredShifts = shifts.filter((shift) => shift.status === 'canceled');
        break;
      default:
        filteredShifts = shifts;
    }

    return (
      <ShiftsTable
        shifts={shifts}
        facilities={facilities}
        onReload={() => window.location.reload()}
      />
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-6 text-2xl font-semibold">Shifts</h2>

      <div className="group relative mb-4 flex justify-end">
        <button
          className={`rounded px-4 py-2 text-white ${
            facilities.length === 0
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-blue-500 hover:bg-blue-700'
          }`}
          onClick={() => setModalIsOpen(true)}
          disabled={facilities.length === 0} // Disable button if no facilities
        >
          + Add Shift
        </button>

        {facilities.length === 0 && (
          <div className="absolute top-full mt-2 w-64 rounded bg-gray-800 p-2 text-sm text-white opacity-0 group-hover:opacity-100">
            You need to create facilities before adding shifts.
          </div>
        )}
      </div>

      <div className="mb-4">
        <ul className="flex border-b">
          <li className="-mb-px mr-1">
            <button
              className={`inline-block bg-white px-4 py-2 font-semibold text-blue-500 ${
                activeTab === 'open-shifts'
                  ? 'rounded-t border-l border-r border-t'
                  : ''
              }`}
              onClick={() => setActiveTab('open-shifts')}
            >
              Open Shifts
            </button>
          </li>
          <li className="-mb-px mr-1">
            <button
              className={`inline-block bg-white px-4 py-2 font-semibold text-blue-500 ${
                activeTab === 'active-shifts'
                  ? 'rounded-t border-l border-r border-t'
                  : ''
              }`}
              onClick={() => setActiveTab('active-shifts')}
            >
              Active Shifts
            </button>
          </li>
          <li className="-mb-px mr-1">
            <button
              className={`inline-block bg-white px-4 py-2 font-semibold text-blue-500 ${
                activeTab === 'canceled-shifts'
                  ? 'rounded-t border-l border-r border-t'
                  : ''
              }`}
              onClick={() => setActiveTab('canceled-shifts')}
            >
              Shifts with Cancellations
            </button>
          </li>
        </ul>
      </div>

      {renderShiftsTable()}

      {/* Modal for Adding New Shift */}
      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Add New Shift</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Shift Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shift Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Shift Title"
                  value={shiftData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Facility Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Facility
                </label>
                <select
                  name="facilityId"
                  value={shiftData.facilityId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Facility</option>
                  {facilities.map((facility) => (
                    <option key={facility._id} value={facility._id}>
                      {facility.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={shiftData.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={shiftData.startTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={shiftData.endTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Base Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Caregivers Needed
                </label>
                <input
                  type="number"
                  name="caregiversNeeded"
                  value={shiftData.caregiversNeeded}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pay Rates
                </label>
                {['RN', 'CNA', 'LPN'].map((type) => (
                  <div key={type} className="mt-2 flex items-center space-x-4">
                    <label className="block w-1/3 text-sm font-medium text-gray-700">
                      {type}
                    </label>
                    <input
                      type="number"
                      name={`payRate_${type}`}
                      placeholder={`Pay rate for ${type}`}
                      value={
                        shiftData.basePriceByNurseType.find(
                          (entry) => entry.nurseType === type,
                        )?.payRate || ''
                      }
                      onChange={(e) =>
                        handlePayRateChange(type, parseFloat(e.target.value))
                      }
                      className="mt-1 block w-2/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Caregivers Needed */}

              {/* Nurse Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nurse Type
                </label>
                <select
                  multiple
                  name="nurseType"
                  value={shiftData.nurseType}
                  onChange={handleMultiSelectChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="RN">Registered Nurse</option>
                  <option value="CNA">Certified Nursing Assistant</option>
                  <option value="LPN">Licensed Practical Nurse</option>
                </select>
              </div>
            </div>

            {/* Save and Cancel Buttons */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmitShift}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
              >
                Save Shift
              </button>
              <button
                onClick={closeModal}
                className="ml-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Shift Modal */}
      {selectedShift && (
        <EditShiftModal
          shift={selectedShift}
          facilities={facilities}
          isOpen={editModalIsOpen}
          onClose={closeEditModal}
          onUpdate={() => window.location.reload()}
        />
      )}

      {/* View Shift Details Modal */}
      <ViewShiftDetailsModal
        isOpen={isShiftDetailsModalOpen}
        onClose={() => setIsShiftDetailsModalOpen(false)}
        shiftTitle={shiftDetails.shiftTitle}
        assignedCaregivers={shiftDetails.assignedCaregivers}
        canceledCaregivers={shiftDetails.canceledCaregivers}
      />
    </div>
  );
}
