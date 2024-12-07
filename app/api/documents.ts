// src/api/documents.ts
export const createDocument = async (documentData: any) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Bearer token for authentication
      },
      body: JSON.stringify(documentData), // Send the document data as JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error creating document');
    }

    return await response.json(); // Return the created document data
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

// src/api/documents.ts
export const getDocuments = async (agencyId: string) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }

  console.log('agencyId', agencyId);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/documents/agency/${agencyId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Bearer token for authentication
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error fetching documents');
    }

    return await response.json(); // Return the list of documents
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const patchDocument = async (
  documentId: string,
  updatedDocument: any,
) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication token not found.');
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/documents/${documentId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedDocument),
      },
    );

    if (!response.ok) {
      throw new Error('Error updating document');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// This function will handle the API request to update the document status.
export const updateDocumentStatus = async (
  caregiverId: string,
  documentTypeId: string,
  status: 'approved' | 'rejected' | 'returned',
  comments?: string,
) => {
  const token = localStorage.getItem('token'); // Get the Bearer token from localStorage

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/caregiverdocuments/status/${caregiverId}/${documentTypeId}`,
      {
        method: 'PATCH', // Use the PATCH method
        headers: {
          Authorization: `Bearer ${token}`, // Attach the Bearer token in the request header
          'Content-Type': 'application/json', // Specify the content type
        },
        body: JSON.stringify({
          status, // Send status in the body
          comments, // Send comments in the body if they exist
        }),
      },
    );

    if (response.ok) {
      return await response.json(); // Return the updated document status
    } else {
      throw new Error('Error updating document status');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
