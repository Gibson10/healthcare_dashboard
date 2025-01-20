'use client'; // Mark this layout as a client component

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // For the SVG image
import Link from 'next/link'; // For the signup link
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

  const [personalInfo, setPersonalInfo] = useState<any>({});

  const router = useRouter();

  // Retrieve personal information from local storage
  useEffect(() => {
    const storedPersonalInfo = localStorage.getItem('personalInfo');
    if (storedPersonalInfo) {
      setPersonalInfo(JSON.parse(storedPersonalInfo));
    }
  }, []);

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
      // Call the centralized registration function
      const data = await registerAgencyAdmin(formData);
      console.log('Registration successful:', data);
      localStorage.setItem('agencyId', data.agencyId); // Store the agencyId
      router.push('/'); // Redirect to the login page after successful registration
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full rounded-sm bg-white shadow-lg xl:max-w-4xl dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          {/* Left Side with Image */}
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-12 py-16 text-center">
              <Link className="mb-5.5 inline-block" href="/">
                <Image
                  className=" dark:block"
                  src={'/images/auth.svg'}
                  alt="Auth Image"
                  width={176}
                  height={32}
                />
              </Link>
              <p className="mt-6 text-lg">
                We help manage nurse staffing, shift management, and payments to
                ensure smooth operations and efficient workforce management in
                healthcare facilities.
              </p>
            </div>
          </div>

          {/* Right Side with Form */}
          <div className="w-full xl:w-1/2 xl:border-l-2 xl:border-stroke dark:border-strokedark">
            <div className="w-full p-8 sm:p-12">
              <span className="mb-1.5 block font-medium">Step 2</span>
              <h2 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2 dark:text-white">
                Agency Information
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Agency Name Field */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Agency Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="agencyName"
                      placeholder="Agency Name"
                      value={agencyInfo.agencyName}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Agency Email Field */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Agency Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="agencyEmail"
                      placeholder="agency@company.com"
                      value={agencyInfo.agencyEmail}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Agency Phone Field */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Agency Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="agencyPhone"
                      placeholder="+9876543210"
                      value={agencyInfo.agencyPhone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Agency Address Field */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Agency Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="agencyAddress"
                      placeholder="123 Main Street"
                      value={agencyInfo.agencyAddress}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                >
                  Register
                </button>

                {/* Sign In Link */}
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                    href="/"
                    className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
