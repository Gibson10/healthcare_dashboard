'use client';

import React, { useState, useEffect } from 'react';
import { updateDocumentStatus } from '@/app/api/documents';
import { FaCheckCircle } from 'react-icons/fa';
import ZoomableIframe from '@/app/ui/caregivers/ZoomableIframe';

interface Document {
  agencyId: string;
  documentTypeId: {
    name: string;
    _id: string;
  };
  fileUrl: string;
  status: string;
  _id: string;
}

interface VerifyDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  careGiverId: string;
}

const VerifyDocumentsModal: React.FC<VerifyDocumentsModalProps> = ({
  isOpen,
  onClose,
  documents,
  careGiverId,
}) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [validUntil, setValidUntil] = useState<string | undefined>('');
  const [comment, setComment] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && documents.length > 0) {
      setSelectedDocument(documents[0]);
    }
  }, [isOpen, documents]);

  const handleVerify = async () => {
    if (selectedDocument) {
      try {
        const updatedDocument = await updateDocumentStatus(
          careGiverId,
          selectedDocument.documentTypeId._id,
          isVerified ? 'approved' : 'rejected',
          comment,
        );

        console.log('Document verified successfully:', updatedDocument);

        onClose();
        setSelectedDocument((prev) => {
          if (prev) {
            return { ...prev, verified: true };
          }
          return prev;
        });
      } catch (error) {
        console.error('Error verifying document:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="flex max-h-[90%] w-4/5 rounded-lg bg-white p-5 shadow-lg">
        {/* Left side: Document list */}
        <div className="w-1/4 rounded-l-lg bg-gray-100 p-3">
          <h2 className="mb-4 text-lg font-semibold">Documents</h2>
          {documents.length > 0 ? (
            <ul className="space-y-2">
              {documents.map((document, index) => (
                <li
                  key={index}
                  className={`cursor-pointer rounded-md p-2 ${
                    selectedDocument === document
                      ? 'bg-blue-500 text-white'
                      : 'bg-white hover:bg-blue-100'
                  }`}
                  onClick={() => setSelectedDocument(document)}
                >
                  <div className="flex items-center justify-between">
                    <span>{document.documentTypeId.name}</span>
                    {document.status === 'approved' && (
                      <FaCheckCircle className="text-green-500" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">
              The candidate has not uploaded any documents.
            </p>
          )}
        </div>

        {/* Middle: Document Verification */}
        <div className="w-1/4 p-5">
          <h2 className="mb-4 text-lg font-semibold">Document Verification</h2>
          {selectedDocument ? (
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700">
                Document Valid Until
              </label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={validUntil || ''}
                onChange={(e) => setValidUntil(e.target.value)}
              />

              <label className="mt-4 block text-sm font-medium text-gray-700">
                Add Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Add comment..."
              />

              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                    checked={isVerified}
                    onChange={() => setIsVerified(!isVerified)}
                  />
                  <span className="ml-2">Verify this document</span>
                </label>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={handleVerify}
                  className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
                >
                  Verify
                </button>
                <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p>Please select a document to verify</p>
          )}
        </div>

        {/* Right side: Document Preview */}
        <div className="w-2/4 p-5">
          <div className="flex justify-between">
            <h2 className="mb-4 text-lg font-semibold">Document Preview</h2>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          {selectedDocument ? (
            <div>
              <p>
                <strong>Name:</strong> {selectedDocument.documentTypeId.name}
              </p>
              <div>
                <ZoomableIframe src={selectedDocument.fileUrl} />
                <button
                  onClick={() =>
                    window.open(selectedDocument.fileUrl, '_blank')
                  }
                  className="mt-4 rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-600"
                >
                  View Fullscreen
                </button>
              </div>
            </div>
          ) : (
            <p>Please select a document to preview</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyDocumentsModal;
