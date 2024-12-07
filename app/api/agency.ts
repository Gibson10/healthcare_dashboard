export const fetchAgencyAnalytics = async (agencyId: string) => {
  const token = localStorage.getItem('token'); // Get Bearer token from localStorage

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/agencies/${agencyId}/analytics`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach Bearer token in the request header
        },
      },
    );

    if (response.ok) {
      return await response.json(); // Return the fetched analytics data
    } else {
      throw new Error('Error fetching analytics data');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
