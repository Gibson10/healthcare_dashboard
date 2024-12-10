import React from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  message?: string; // Optional custom message
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  message = 'Are you sure you want to delete?',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">{message}</h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
