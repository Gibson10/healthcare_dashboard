'use client'; // Mark this layout as a client component

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // For the SVG image
import Link from 'next/link'; // For the signup link

interface PersonalInfo {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export default function RegisterPersonalPage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    console.log('Form Data:', personalInfo);

    try {
      // Assuming you handle the registration logic here
      localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
      router.push('/register/agency'); // Redirect to the agency details page
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('An error occurred:', error);
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
              <span className="mb-1.5 block font-medium">Step 1</span>
              <h2 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2 dark:text-white">
                Personal Information
              </h2>

              <form onSubmit={handleNext}>
                {/* Name Field */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Your name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={personalInfo.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Your email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="name@company.com"
                      value={personalInfo.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Phone number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1234567890"
                      value={personalInfo.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={personalInfo.password}
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
                  {loading ? 'Loading...' : 'Next'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
