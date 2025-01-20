'use client'; // Mark this layout as a client component

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login } from './api/auth'; // Import the centralized API function
import Image from 'next/image'; // For the SVG image
import Link from 'next/link'; // For the signup link

interface LoginFormData {
  email: string;
  password: string;
}

export default function Page() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Correctly update email or password
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log('Form Data:', formData);

    try {
      const data = await login(formData.email, formData.password); // Call the centralized API function
      console.log('Data:', data);
      setLoading(false);
      if (data.access_token) {
        router.push('/dashboard'); // Redirect to dashboard
      }
    } catch (error) {
      setLoading(false);
      console.error('An error occurred:', error);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
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
                  We help manage nurse staffing, shift management, and payments
                  to ensure smooth operations and efficient workforce management
                  in healthcare facilities.
                </p>
              </div>
            </div>

            {/* Right Side with Form */}
            <div className="w-full xl:w-1/2 xl:border-l-2 xl:border-stroke dark:border-strokedark">
              <div className="w-full p-8 sm:p-12">
                <span className="mb-1.5 block font-medium">Start</span>
                <h2 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2 dark:text-white">
                  Sign In
                </h2>

                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
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
                        placeholder="6+ Characters, 1 Capital letter"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  {/* Sign In Button */}
                  <div className="mb-5">
                    <input
                      type="submit"
                      value={loading ? 'Sign In...' : 'Sign In'}
                      className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    />
                  </div>

                  {/* Sign In with Google Button */}

                  {/* Link to Sign Up Page */}
                  <div className="mt-6 text-center">
                    <p>
                      Don’t have an account?{' '}
                      <Link href="/register" className="text-primary">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
