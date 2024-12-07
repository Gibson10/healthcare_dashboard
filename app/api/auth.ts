export const login = async (email: string, password: string) => {
  const loginData = {
    email,
    password,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/auth/login/agency-admin`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      },
    );
    console.log('response', response);
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.access_token); // Store token in localStorage
      localStorage.setItem('agencyId', data.agencyId); // Store agencyId in localStorage
      return data; // Return the token and agencyId
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const registerAgencyAdmin = async (formData: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/auth/register/agency-admin`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      },
    );

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('agencyId', data.agencyId); // Store the agencyId in localStorage
      return data; // Return the response data
    } else {
      throw new Error('Registration failed');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
