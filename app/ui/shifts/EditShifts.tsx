// components/EditShiftModal.tsx
import { useState, useEffect } from 'react';
import { Shift, updateShift } from '../../api/shifts';

interface EditShiftModalProps {
  shift: Shift | null;
  facilities: any[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditShiftModal: React.FC<EditShiftModalProps> = ({
  shift,
  facilities,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [updatedShiftData, setUpdatedShiftData] = useState({
    title: '',
    facilityId: '',
    date: '',
    startTime: '',
    endTime: '',
    status: 'open',
    caregiversNeeded: 0,
    nurseType: [] as string[], // array for multi-select
    basePrice: 0,
  });

  useEffect(() => {
    if (shift) {
      setUpdatedShiftData({
        title: shift.title,
        facilityId: shift.facilityId ? shift.facilityId._id : '',
        date: shift.date.slice(0, 10),
        startTime: new Date(shift.startTime).toISOString().slice(11, 16),
        endTime: new Date(shift.endTime).toISOString().slice(11, 16),
        status: shift.status,
        caregiversNeeded: shift.caregiversNeeded || 0,
        nurseType: shift.nurseType || [],
        basePrice: shift.basePrice || 0,
      });
    }
  }, [shift]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUpdatedShiftData({
      ...updatedShiftData,
      [name]:
        name === 'caregiversNeeded' || name === 'basePrice'
          ? Number(value)
          : value,
    });
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    setUpdatedShiftData((prevState) => ({
      ...prevState,
      nurseType: selectedOptions,
    }));
  };

  const handleSubmit = async () => {
    try {
      const combinedStartTime = new Date(
        `${updatedShiftData.date}T${updatedShiftData.startTime}`,
      );
      const combinedEndTime = new Date(
        `${updatedShiftData.date}T${updatedShiftData.endTime}`,
      );

      const shiftToSubmit = {
        ...updatedShiftData,
        startTime: combinedStartTime,
        endTime: combinedEndTime,
      };

      await updateShift(shift?._id, shiftToSubmit);
      onClose();
      onUpdate();
    } catch (err) {
      console.error('Error updating shift:', err);
    }
  };

  if (!isOpen || !shift) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Edit Shift</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Shift Title
            </label>
            <input
              type="text"
              name="title"
              value={updatedShiftData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Facility
            </label>
            <select
              name="facilityId"
              value={updatedShiftData.facilityId}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Caregivers Needed
            </label>
            <input
              type="number"
              name="caregiversNeeded"
              value={updatedShiftData.caregiversNeeded}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nurse Type
            </label>
            <select
              multiple
              name="nurseType"
              value={updatedShiftData.nurseType}
              onChange={handleMultiSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="RN">Registered Nurse</option>
              <option value="CNA">Certified Nursing Assistant</option>
              <option value="HHA">Home Healthcare Assistant</option>
              <option value="LPN">Licensed Practical Nurse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Base Price
            </label>
            <input
              type="number"
              name="basePrice"
              value={updatedShiftData.basePrice}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="date"
              value={updatedShiftData.date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={updatedShiftData.startTime}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={updatedShiftData.endTime}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="ml-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditShiftModal;
