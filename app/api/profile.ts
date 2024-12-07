export const updateProfile = async (id: string, profileData: any) => {
  const token = localStorage.getItem('token'); // Retrieve the Bearer token from localStorage

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/agencies/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach the Bearer token in the request header
        },
        body: JSON.stringify(profileData), // Send the updated profile data as the request body
      },
    );

    if (response.ok) {
      return await response.json(); // Return the updated profile data
    } else {
      throw new Error('Error updating profile');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const fetchAgencyProfile = async (agencyId: string) => {
  const token = localStorage.getItem('token'); // Get the Bearer token from localStorage

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/agencies/${agencyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the Bearer token in the request header
        },
      },
    );

    if (response.ok) {
      return await response.json(); // Return the fetched profile data
    } else {
      throw new Error('Error fetching profile');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
