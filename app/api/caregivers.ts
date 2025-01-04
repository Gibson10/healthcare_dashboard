// caregiver.ts
// export class Caregiver {
//   constructor(
//     public _id: string,
//     public name: string,
//     public email: string,
//     public nurseType: 'CNA' | 'RN' | 'LPN',
//     public phone: string,
//     public dateJoined: Date,
//     public uploadedDocuments: string[],
//   ) {}
// }

export interface Caregiver {
  _id: string;
  name: string;
  email: string;
  phone: string;
  userId: string;
  nurseType: string;
  appliedAgencies: string[];
  approvedStatus: boolean;
  uploadedDocuments: UploadedDocument[];
  dateJoined: string;
}

export interface UploadedDocument {
  agencyId: string;
  documentTypeId: {
    name: string; // Populated document name
    _id: string;
  };
  fileUrl: string;
  status: string;
  _id: string;
}

export const fetchCaregivers = async (agencyId: string) => {
  const token = localStorage.getItem('token'); // Get the Bearer token from localStorage

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/agencies/${agencyId}/applied-caregivers`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the Bearer token to the header
        },
      },
    );

    if (response.ok) {
      return await response.json(); // Return the fetched caregivers
    } else {
      throw new Error('Error fetching caregivers');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const fetchCaregiverDetails = async (
  caregiverId: string,
  agencyId: string,
) => {
  const token = localStorage.getItem('token'); // Get the Bearer token from localStorage

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/caregivers/details/${caregiverId}?agencyId=${agencyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the Bearer token to the header
        },
      },
    );

    if (response.ok) {
      return await response.json(); // Return the fetched caregiver details
    } else {
      throw new Error('Error fetching caregiver details');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const notify = async (caregiverId: string, message: string) => {
  const token = localStorage.getItem('token'); // Get the Bearer token from localStorage

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/users/notify/${caregiverId}`, // Correct endpoint
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify content type
          Authorization: `Bearer ${token}`, // Add the Bearer token to the header
        },
        body: JSON.stringify({ message }), // Include message in the request body
      },
    );

    if (response.ok) {
      return await response.json(); // Return the response data
    } else {
      const errorData = await response.json(); // Parse error response
      throw new Error(errorData.message || 'Error sending notification');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
