'use client'; // Mark this layout as a client component

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { registerAgencyAdmin } from '../../api/auth';

interface AgencyInfo {
  agencyName: string;
  agencyEmail: string;
  agencyPhone: string;
  agencyAddress: string;
}

export default function RegisterAgencyPage() {
  const [agencyInfo, setAgencyInfo] = useState<AgencyInfo>({
    agencyName: '',
    agencyEmail: '',
    agencyPhone: '',
    agencyAddress: '',
  });

  const router = useRouter();

  // Retrieve personal information from local storage
  const personalInfo = JSON.parse(localStorage.getItem('personalInfo') || '{}');

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAgencyInfo({
      ...agencyInfo,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formData = { ...personalInfo, ...agencyInfo }; // Combine personal and agency info
    try {
      const data = await registerAgencyAdmin(formData); // Call the centralized registration function
      console.log('Registration successful:', data);
      localStorage.setItem('agencyId', data.agencyId); // Store the agencyId
      router.push('/'); // Redirect to the login page after successful registration
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <a
          href="#"
          className="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Omni Healthcare Management
        </a>
        <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Agency Information
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Agency name
                </label>
                <input
                  type="text"
                  name="agencyName"
                  id="agencyName"
                  value={agencyInfo.agencyName}
                  onChange={handleChange}
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Agency Name"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Agency email
                </label>
                <input
                  type="email"
                  name="agencyEmail"
                  id="agencyEmail"
                  value={agencyInfo.agencyEmail}
                  onChange={handleChange}
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="agency@company.com"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Agency phone number
                </label>
                <input
                  type="tel"
                  name="agencyPhone"
                  id="agencyPhone"
                  value={agencyInfo.agencyPhone}
                  onChange={handleChange}
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="+9876543210"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Agency address
                </label>
                <input
                  type="text"
                  name="agencyAddress"
                  id="agencyAddress"
                  value={agencyInfo.agencyAddress}
                  onChange={handleChange}
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <button
                type="submit"
                className="hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
              >
                Register
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <a
                  href="#"
                  className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
