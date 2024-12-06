export interface Shift {
  _id: string;
  title: string;
  facilityId: Facility;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  basePrice: number;
  caregiversNeeded: number;
  assignedCaregivers: any[];
  cancelledCaregivers: any[];
  nurseType: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateShiftDto {
  title: string;
  facilityId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  status: string;

  // New fields
  caregiversNeeded: number; // Required number of caregivers for the shift
  nurseType: string[]; // Array of required nurse types (CNA, RN, etc.)
}

export const createShift = async (
  shiftData: CreateShiftDto,
): Promise<Shift> => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/shifts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(shiftData),
    });

    if (response.ok) {
      const data: Shift = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error creating shift');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const fetchShifts = async (agencyId: string): Promise<Shift[]> => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/shifts/agency/${agencyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data: Shift[] = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error fetching shifts');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// src/api/shifts.ts

export const updateShift = async (
  shiftId: string,
  updatedShiftData: any,
): Promise<void> => {
  const token = localStorage.getItem('token'); // Get the auth token from localStorage
  if (!token) {
    throw new Error('Authentication token not found');
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/shifts/${shiftId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedShiftData),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error updating shift');
    }
  } catch (error) {
    console.error('Error updating shift:', error);
    throw error;
  }
};
