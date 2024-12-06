import { useState } from 'react';

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: any;
  onSubmit: (updatedDocument: any) => void;
}

interface DocumentType {
  name: string;
  appliesTo: string[];
  appliesToAll: boolean;
  agencyId: string | null;
}

const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
  isOpen,
  onClose,
  documentData,
  onSubmit,
}) => {
  const [updatedDocument, setUpdatedDocument] = useState(documentData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setUpdatedDocument((prev: DocumentType) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(updatedDocument);
  };
  console.log('updatedDocument67', updatedDocument);
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Edit Document</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label>Document Name</label>
                <input
                  type="text"
                  name="name"
                  value={updatedDocument.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  placeholder="Document Name"
                />
              </div>
              <div>
                <label>Applies To</label>
                <select
                  multiple
                  name="appliesTo"
                  value={updatedDocument.appliesTo}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300"
                >
                  <option value="nurse">Nurse</option>
                  <option value="cna">CNA</option>
                  <option value="home_healthcare">Home Healthcare</option>
                </select>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="appliesToAll"
                    checked={updatedDocument.appliesToAll}
                    className="rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    onChange={() =>
                      setUpdatedDocument((prev: DocumentType) => ({
                        ...prev,
                        appliesToAll: !prev.appliesToAll,
                      }))
                    }
                  />
                  Applies to All Providers
                </label>
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
      )}
    </>
  );
};

export default EditDocumentModal;
