'use client';

import { useState, useEffect } from 'react';
import { fetchFacilities } from '../../api/facilities';
import { fetchShifts, createShift, Shift } from '../../api/shifts';
import EditShiftModal from '../../ui/shifts/EditShifts';
import ViewShiftDetailsModal from '../../ui/shifts/ViewShiftModelDetails';
import { toast, ToastContainer } from 'react-toastify';

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
        basePrice: Number(shiftData.basePrice),
      };
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
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                ID
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Facility
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Starting On
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Status
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredShifts.map((shift, index) => (
              <tr key={shift._id}>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  {index + 1}
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  {shift.facilityId?.name}
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  {new Date(shift.date).toLocaleDateString()}{' '}
                  {new Date(shift.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}{' '}
                  -{' '}
                  {new Date(shift.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  {shift.status}
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  <button
                    onClick={() => openEditModal(shift)}
                    className="mr-2 text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                  <button
                    onClick={() => openDetailsModal(shift)}
                    className="ml-2 text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-6 text-2xl font-semibold">Shifts</h2>

      <div className="mb-4 flex justify-end">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => setModalIsOpen(true)}
        >
          + Add Shift
        </button>
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
                  Base Pay
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={shiftData.basePrice}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Caregivers Needed */}
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
                  <option value="HHA">Home Healthcare Assistant</option>
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
