'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';

import { fetchCaregiverDetails, notify } from '../../../../api/caregivers';
import ShiftsTable from '../../../../ui/shifts/ShiftsTable';

const CaregiverDetails = () => {
  const agencyId = localStorage.getItem('agencyId');
  const [caregiver, setCaregiver] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const params = useParams();
  const caregiverId = params.id;

  useEffect(() => {
    if (caregiverId && agencyId) {
      fetchCaregiver();
    }
  }, [caregiverId, agencyId]);

  const fetchCaregiver = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCaregiverDetails(caregiverId, agencyId);
      console.log('Caregiver details before transformation:', data);

      // Transform assignedShifts to include facilityInfo as facilityId
      const transformedAssignedShifts = data.assignedShifts.map((shift) => ({
        ...shift,
        facilityId: shift.facilityInfo, // Populate facilityId with facilityInfo
      }));

      // Update caregiver data with transformed assignedShifts
      const transformedData = {
        ...data,
        assignedShifts: transformedAssignedShifts,
      };

      console.log('Caregiver details after transformation:', transformedData);
      setCaregiver(transformedData);
    } catch (error) {
      console.error('Error fetching caregiver details:', error);
      toast.error('Failed to load caregiver details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNotification = async () => {
    try {
      await notify(caregiverId, notificationMessage);
      toast.success('Notification sent successfully!');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setNotificationModalOpen(false);
    }
  };

  if (isLoading) return <div>Loading caregiver details...</div>;

  return (
    <div className="bg-gray-100 p-6">
      <div className="container mx-auto">
        {/* Grid layout for profile and documents */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <div className="col-span-1 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
              Caregiver Profile
            </h2>
            <p>
              <strong>Name:</strong> {caregiver?.profile?.name}
            </p>
            <p>
              <strong>Email:</strong> {caregiver?.profile?.email}
            </p>
            <p>
              <strong>Phone:</strong> {caregiver?.profile?.phone}
            </p>
          </div>

          {/* Documents Section */}
          <div className="col-span-2 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
              Uploaded Documents
            </h2>
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Document Type
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {caregiver.documents.map((doc) => (
                  <tr key={doc.documentTypeId}>
                    <td className="border border-gray-300 px-4 py-2">
                      {doc.documentName}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 ${
                        doc.status === 'approved'
                          ? 'text-green-600'
                          : doc.status === 'rejected'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                      }`}
                    >
                      {doc.status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => window.open(doc.fileUrl, '_blank')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Document
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shifts Section */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            Assigned Shifts
          </h2>
          <ShiftsTable shifts={caregiver.assignedShifts} />
        </div>

        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            Canceled Shifts
          </h2>
          <ShiftsTable shifts={caregiver.canceledShifts} />
        </div>

        {/* Notify Button */}
        <button
          onClick={() => setNotificationModalOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
        >
          Notify Caregiver
        </button>

        {/* Notification Modal */}
        {isNotificationModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">
                Send Notification to Caregiver
              </h2>
              <textarea
                className="mb-4 w-full rounded-lg border p-2"
                placeholder="Type your message here"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
              />
              <button
                onClick={handleSendNotification}
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Send Notification
              </button>
              <button
                onClick={() => setNotificationModalOpen(false)}
                className="ml-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaregiverDetails;
