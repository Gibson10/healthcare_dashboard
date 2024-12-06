'use client';

import { useState, useEffect } from 'react';
import { Caregiver } from '@/app/api/caregivers';
import { fetchCaregivers } from '@/app/api/caregivers';
import VerifyDocumentsModal from '../../ui/caregivers/VerifyDocument'; // Import the modal
import { UploadedDocument } from '../../api/caregivers';

export default function Page() {
  const [activeTab, setActiveTab] = useState<
    'verify-documents' | 'verified-caregivers'
  >('verify-documents');
  const [caregiversData, setCaregiversData] = useState<Caregiver[]>([]); // Caregivers data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [careGiverId, setCareGiverId] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<
    UploadedDocument[]
  >([]);

  // Fetch caregivers when the component mounts or activeTab changes
  useEffect(() => {
    fetchCaregiversData();
  }, [activeTab]);

  const handleVerifyClick = (
    documents: UploadedDocument[],
    careGiverId: string,
  ) => {
    setSelectedDocuments(documents);
    setCareGiverId(careGiverId);
    setIsModalOpen(true);
  };

  // Function to fetch applied caregivers
  const fetchCaregiversData = async () => {
    try {
      const agencyId = localStorage.getItem('agencyId');
      if (!agencyId) {
        console.error('No agencyId found');
        return;
      }

      const caregivers = await fetchCaregivers(agencyId);
      setCaregiversData(caregivers);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
    }
  };

  // Categorize caregivers based on the active tab
  const getFilteredCaregivers = () => {
    if (activeTab === 'verify-documents') {
      return caregiversData.filter((caregiver) => !caregiver.approvedStatus); // Caregivers needing verification
    } else if (activeTab === 'verified-caregivers') {
      return caregiversData.filter((caregiver) => caregiver.approvedStatus); // Already verified caregivers
    }
    return [];
  };

  const renderTable = () => {
    const filteredCaregivers = getFilteredCaregivers();

    return (
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                ID
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Name
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Email
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Nurse Type
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Telephone
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Date Joined
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCaregivers.length > 0 ? (
              filteredCaregivers.map((caregiver, index) => (
                <tr key={caregiver._id}>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {index + 1}
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {caregiver.name}
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {caregiver.email}
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {caregiver.nurseType}
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {caregiver.phone}
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {new Date(caregiver.dateJoined).toLocaleDateString()}
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <button
                      onClick={() =>
                        handleVerifyClick(
                          caregiver.uploadedDocuments,
                          caregiver._id,
                        )
                      } // Pass documents here
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {activeTab === 'verify-documents' ? 'Verify' : 'View'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border-b border-gray-200 bg-white px-5 py-5 text-sm"
                  colSpan={7}
                >
                  No data available in table
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="xs:flex-row xs:justify-between flex flex-col items-center border-t bg-white px-5 py-5">
          <span className="xs:text-sm text-xs text-gray-900">
            Showing {filteredCaregivers.length} caregivers
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-6 text-2xl font-semibold">Caregivers</h2>

      <div className="mb-4">
        <ul className="flex border-b">
          <li className="-mb-px mr-1">
            <button
              className={`inline-block bg-white px-4 py-2 font-semibold text-blue-500 ${
                activeTab === 'verify-documents'
                  ? 'rounded-t border-l border-r border-t'
                  : ''
              }`}
              onClick={() => setActiveTab('verify-documents')}
            >
              Verify Documents
            </button>
          </li>
          <li className="-mb-px mr-1">
            <button
              className={`inline-block bg-white px-4 py-2 font-semibold text-blue-500 ${
                activeTab === 'verified-caregivers'
                  ? 'rounded-t border-l border-r border-t'
                  : ''
              }`}
              onClick={() => setActiveTab('verified-caregivers')}
            >
              Verified Caregivers
            </button>
          </li>
        </ul>
      </div>

      {renderTable()}

      <VerifyDocumentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documents={selectedDocuments}
        careGiverId={careGiverId}
      />
    </div>
  );
}
