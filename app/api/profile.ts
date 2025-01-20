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

export const updateLogo = async (id: string, logoFile: File) => {
  const token = localStorage.getItem('token'); // Retrieve the Bearer token from localStorage
  console.log('logoFile', logoFile);
  console.log('id', id);
  const formData = new FormData();
  formData.append('file', logoFile); // Append the logo file to the FormData

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/agencies/${id}/logo`, // Assuming you have a separate endpoint for logo update
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`, // Attach the Bearer token in the request header
        },
        body: formData, // Use FormData to send the file
      },
    );

    if (response.ok) {
      return await response.json(); // Return the updated logo URL or confirmation data
    } else {
      throw new Error('Error updating logo');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
