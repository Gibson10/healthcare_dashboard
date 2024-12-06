// components/ViewShiftDetailsModal.tsx

import React from 'react';

interface Caregiver {
  name: string;
  email: string;
  phone: string;
  nurseType: string;
}

interface ShiftDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  shiftTitle: string;
  assignedCaregivers: Caregiver[];
  canceledCaregivers: Caregiver[];
}

const ViewShiftDetailsModal: React.FC<ShiftDetailsProps> = ({
  isOpen,
  onClose,
  shiftTitle,
  assignedCaregivers,
  canceledCaregivers,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-4/5 max-w-lg rounded-lg bg-white p-6 shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold">{shiftTitle} - Details</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-bold text-lg"
          >
            &times;
          </button>
        </div>

        {/* Assigned Caregivers */}
        <div className="mt-4">
          <h3 className="text-lg font-medium text-blue-600">Assigned Caregivers</h3>
          <ul className="mt-2 space-y-2">
            {assignedCaregivers.length > 0 ? (
              assignedCaregivers.map((caregiver, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md bg-blue-50 shadow-sm"
                >
                  <span>{caregiver.name}</span>
                  <span className="text-gray-600 text-sm">{caregiver.nurseType}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No caregivers assigned to this shift.</p>
            )}
          </ul>
        </div>

        {/* Cancelled Caregivers */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-red-600">Cancelled Caregivers</h3>
          <ul className="mt-2 space-y-2">
            {canceledCaregivers.length > 0 ? (
              canceledCaregivers.map((caregiver, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md bg-red-50 shadow-sm"
                >
                  <span>{caregiver.name}</span>
                  <span className="text-gray-600 text-sm">{caregiver.nurseType}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No cancellations for this shift.</p>
            )}
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewShiftDetailsModal;
