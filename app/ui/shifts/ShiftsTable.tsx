import React, { useState } from 'react';
import EditShiftModal from '../../ui/shifts/EditShifts';
import ViewShiftDetailsModal from '../../ui/shifts/ViewShiftModelDetails';
import { Shift, deleteShift } from '../../api/shifts';
import DeleteModal from '../modals/DeleteModal';
import { toast, ToastContainer } from 'react-toastify';
import Link from 'next/link';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

type Facility = {
  _id: string;
  name: string;
};

interface ShiftsTableProps {
  shifts: Shift[];
  facilities: Facility[]; // Pass facilities for modals
  onReload?: () => void; // Optional callback to reload shifts after updates
}

const ShiftsTable: React.FC<ShiftsTableProps> = ({
  shifts,
  facilities,
  onReload,
}) => {
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [shiftDetails, setShiftDetails] = useState({
    shiftTitle: '',
    assignedCaregivers: [] as any[],
    canceledCaregivers: [] as any[],
  });

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEditShift = (shift: Shift) => {
    setSelectedShift(shift);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (id: string) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (deleteId) {
        // Call your delete function for facilities or shifts
        await deleteShift(deleteId); // Use the method here
        toast.success('Shift deleted successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      window.location.reload();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Error deleting the shift, please try again', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      handleCloseDeleteModal();
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteId(null);
    setDeleteModalOpen(false);
  };

  const handleViewShiftDetails = (shift: Shift) => {
    setShiftDetails({
      shiftTitle: shift.title,
      assignedCaregivers: shift.assignedCaregivers || [],
      canceledCaregivers: shift.cancelledCaregivers || [],
    });
    setIsDetailsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedShift(null);
    if (onReload) onReload(); // Reload data if needed
  };

  // const handleDeleteShift = (shiftId: string) => {};
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  return (
    <div className="mt-4 overflow-x-auto rounded-lg bg-white shadow-md">
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
              Nurse Types
            </th>
            <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift, index) => (
            <tr key={shift._id}>
              <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                {index + 1}
              </td>
              <td className="flex items-center space-x-4 border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <img
                  src={shift.facilityId?.picture || '/placeholder-image.png'}
                  alt={`${shift.facilityId?.name} picture`}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span>{shift.facilityId?.name}</span>
              </td>
              <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm font-bold">
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
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    shift.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : shift.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : shift.status === 'completed'
                          ? 'bg-gray-100 text-gray-800'
                          : shift.status === 'canceled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {shift.status}
                </span>
              </td>
              <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <div className="flex flex-wrap gap-2">
                  {shift.nurseType.map((type) => (
                    <span
                      key={type}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        type === 'RN'
                          ? 'bg-blue-100 text-blue-800'
                          : type === 'CNA'
                            ? 'bg-green-100 text-green-800'
                            : type === 'LPN'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </td>
              <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <button
                  onClick={() => handleEditShift(shift)}
                  className="mr-2 text-blue-600 hover:text-blue-900"
                >
                  <PencilIcon className="h-5 w-5" /> {/* Edit Icon */}
                </button>
                <Link href={`/dashboard/shifts/view/${shift._id}`}>
                  <button className="ml-2 text-blue-600 hover:text-blue-900">
                    <EyeIcon className="h-5 w-5" /> {/* View Icon */}
                  </button>
                </Link>
                <button
                  onClick={() => handleOpenDeleteModal(shift._id)}
                  className="ml-4 text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" /> {/* Delete Icon */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Shift Modal */}
      {selectedShift && (
        <EditShiftModal
          shift={selectedShift}
          facilities={facilities}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={() => window.location.reload()} // Optionally reload shifts after editing
        />
      )}

      {/* View Shift Details Modal */}
      <ViewShiftDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        shiftTitle={shiftDetails.shiftTitle}
        assignedCaregivers={shiftDetails.assignedCaregivers}
        canceledCaregivers={shiftDetails.canceledCaregivers}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDelete}
        message="Are you sure you want to delete this shift?"
      />
    </div>
  );
};

export default ShiftsTable;
