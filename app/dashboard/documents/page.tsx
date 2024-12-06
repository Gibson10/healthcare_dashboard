'use client';

import { useState, useEffect } from 'react';
import {
  createDocument,
  getDocuments,
  patchDocument,
} from '../../api/documents';
import EditDocumentModal from '../../ui/documents/editdocuments';

type DocumentData = {
  name: string;
  appliesTo: string[];
  appliesToAll: boolean;
  agencyId: string | null;
};

export default function DocumentsPage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentData, setDocumentData] = useState<DocumentData>({
    name: '',
    appliesTo: [],
    appliesToAll: false,
    agencyId: null,
  });

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setDocumentData((prevState) => ({
        ...prevState,
        appliesTo: ['nurse', 'cna', 'home_healthcare'],
        appliesToAll: true,
      }));
    } else {
      setDocumentData((prevState) => ({
        ...prevState,
        appliesTo: [],
        appliesToAll: false,
      }));
    }
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option: HTMLOptionElement) => option.value,
    );

    setDocumentData((prevState) => ({
      ...prevState,
      appliesTo: selectedOptions,
      appliesToAll: false,
    }));
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setDocumentData({
      ...documentData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmitDocument = async () => {
    try {
      documentData.agencyId = localStorage.getItem('agencyId');
      await createDocument(documentData);
      closeModal();
      window.location.reload();
    } catch (err) {
      console.error('Error creating document:', err);
    }
  };

  const handleEditClick = (document: any) => {
    console.log('document', document);
    setSelectedDocument(document);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedDocument(null);
  };

  const handleDocumentUpdate = async (updatedDocument: any) => {
    try {
      console.log('updatedDocumentclick', updatedDocument);
      await patchDocument(updatedDocument._id, updatedDocument);

      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc._id === updatedDocument._id ? updatedDocument : doc,
        ),
      );
      handleCloseModal();
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      const agencyId = localStorage.getItem('agencyId');

      if (!agencyId) {
        console.error('No agencyId found');
        return;
      }
      try {
        const data = await getDocuments(agencyId);
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Document Types</h2>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          onClick={openModal}
        >
          + Add Document
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full table-auto leading-normal">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
              <th className="px-6 py-3">No.</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Required</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {documents.map((doc, index) => (
              <tr key={doc.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center">{index + 1}</td>
                <td className="px-6 py-4">{doc.name}</td>
                <td className="px-6 py-4 text-center">
                  {doc.appliesTo.length}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEditClick(doc)}
                    className="mr-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Add New Document</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Document Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={documentData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Document Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Applies To
                </label>
                <select
                  multiple
                  name="appliesTo"
                  value={documentData.appliesTo}
                  onChange={handleMultiSelectChange} // Updated event handler
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="Rn">Registered Nurse</option>
                  <option value="cna">CNA</option>
                  <option value="hha">Home Healthcare Assistant</option>
                  <option value="lpn">LPN</option>
                </select>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="appliesToAll"
                    checked={documentData.appliesToAll}
                    onChange={handleCheckboxChange}
                    className="mr-2 rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="ml-2">Applies to All Providers</span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmitDocument}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
              >
                Save Document
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
      {selectedDocument && (
        <EditDocumentModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          documentData={selectedDocument}
          onSubmit={handleDocumentUpdate}
        />
      )}
    </div>
  );
}
