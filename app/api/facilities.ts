export interface Facility {
  name: string;

  location: {
    latitude: number;
    longitude: number;
  };

  textLocation: string; // Full address in string format

  picture?: string;

  email: string;
  phone: string;

  buildingName?: string; // Optional field for building name
  floor?: string; // Optional field for floor
  description?: string; // Optional field for description

  agencyId: string; // Required to link the facility to an agency
}

export const createFacility = async (
  facilityData: any,
  selectedImage: File | null,
) => {
  const token = localStorage.getItem('token'); // Get the Bearer token from localStorage
  console.log('token', token);

  const formData = new FormData();
  formData.append('name', facilityData.name);
  formData.append('location[latitude]', String(facilityData.location.latitude));
  formData.append(
    'location[longitude]',
    String(facilityData.location.longitude),
  );
  formData.append('textLocation', facilityData.textLocation);
  formData.append('phone', facilityData.telephone);
  formData.append('email', facilityData.email);
  formData.append('buildingName', facilityData.building || '');
  formData.append('floor', facilityData.floor || '');
  formData.append('description', facilityData.description || '');
  formData.append('agencyId', facilityData.agencyId || '');

  if (selectedImage) {
    formData.append('image', selectedImage);
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/facilities`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // Add the Bearer token to the header
      },
      body: formData, // Send formData
    });

    if (response.ok) {
      return await response.json(); // Return the created facility response
    } else {
      throw new Error('Error creating facility');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const fetchFacilities = async (agencyId: string) => {
  const token = localStorage.getItem('token'); // Get the Bearer token from localStorage

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/facilities/agency/${agencyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the Bearer token to the header
        },
      },
    );

    if (response.ok) {
      return await response.json(); // Return the fetched facilities
    } else {
      throw new Error('Error fetching facilities');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// src/api/index.ts

export const fetchFacilityById = async (facilityId: string): Promise<any> => {
  const token = localStorage.getItem('token'); // Assuming you're using JWT or a similar auth mechanism

  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/facilities/${facilityId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error fetching facility data');
    }

    const data = await response.json();
    return data; // Return facility data
  } catch (error) {
    console.error('Error fetching facility:', error);
    throw error;
  }
};

// src/api/index.ts

export const updateFacility = async (
  facilityId: string,
  facilityData: any,
  selectedImage: File | null,
): Promise<any> => {
  const token = localStorage.getItem('token'); // Assuming you're using JWT or a similar auth mechanism

  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }

  const formData = new FormData();
  formData.append('name', facilityData.name);
  formData.append('location', JSON.stringify(facilityData.location)); // Convert location object to string
  formData.append('textLocation', facilityData.textLocation);
  formData.append('telephone', facilityData.phone);
  formData.append('email', facilityData.email);
  formData.append('floor', facilityData.floor);
  formData.append('buildingName', facilityData.buildingName);
  formData.append('description', facilityData.description);

  if (selectedImage) {
    formData.append('image', selectedImage); // Add image if available
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/facilities/${facilityId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error updating facility');
    }

    const data = await response.json();
    return data; // Return updated facility data
  } catch (error) {
    console.error('Error updating facility:', error);
    throw error;
  }
};

export const deleteFacility = async (facilityId: string): Promise<void> => {
  const token = localStorage.getItem('token'); // Get the Bearer token from localStorage

  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/facilities/${facilityId}`,
      {
        method: 'DELETE', // Specify DELETE method
        headers: {
          Authorization: `Bearer ${token}`, // Add the Bearer token to the header
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error deleting facility');
    }
  } catch (error) {
    console.error('Error deleting facility:', error);
    throw error;
  }
};
