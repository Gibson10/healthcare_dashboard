'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  fetchAgencyProfile,
  updateLogo,
  updateProfile,
} from '../../api/profile';

export default function UpdateProfilePage() {
  // State to store the profile data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    agencyLogo: '', // Add field for the agency logo URL
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null); // State for the logo preview

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const agencyId = localStorage.getItem('agencyId');
    if (agencyId) {
      fetchProfile(agencyId);
    }
  }, []);

  const fetchProfile = async (agencyId: string) => {
    try {
      const data = await fetchAgencyProfile(agencyId);
      setProfileData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        agencyLogo: data.agencyLogo || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle the file change for the logo upload
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLogoFile(e.target.files[0]);
    }
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Create a preview URL for the selected file
      setLogoPreview(previewUrl);
    }
  };

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const agencyId = localStorage.getItem('agencyId');
      if (!agencyId) {
        console.error('No agencyId found');
        return;
      }
      setLoading(true);

      // Submit the other profile details (e.g., name, email, etc.)
      const response = await updateProfile(agencyId, profileData);
      toast.success('Profile updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  const handleLogoSubmit = async () => {
    if (!logoFile) {
      toast.error('Please select a logo image to upload', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      const agencyId = localStorage.getItem('agencyId');
      if (!agencyId) {
        console.error('No agencyId found');
        return;
      }

      setLoading(true);
      const logoUrl = await updateLogo(agencyId, logoFile); // Update logo
      setProfileData((prev) => ({ ...prev, agencyLogo: logoUrl }));

      toast.success('Logo updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error uploading logo:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-5 gap-8">
          {/* Left Column */}
          <div className="col-span-5 xl:col-span-3">
            <div className="shadow-default rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Profile Information
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleProfileSubmit}>
                  {/* Name */}
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Full Name
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      placeholder="Agency Name"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Email Address
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      placeholder="agency@company.com"
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Phone Number
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      placeholder="+1234567890"
                    />
                  </div>

                  {/* Address */}
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Address
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="hover:shadow-1 flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black dark:border-strokedark dark:text-white"
                      type="button"
                      onClick={() => router.push('/dashboard')}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Image Section */}
          <div className="col-span-5 xl:col-span-2">
            <div className="shadow-default rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Update Agency Logo
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full">
                      <img
                        src={
                          logoPreview ||
                          profileData.agencyLogo ||
                          '/profile-user.png'
                        } // Show preview or existing logo
                        width={55}
                        height={55}
                        alt="Agency Logo"
                      />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Edit your logo
                      </span>
                    </div>
                  </div>

                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 sm:py-7.5 dark:bg-meta-4"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                      onChange={handleLogoChange} // Handle logo file change
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p>
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="hover:shadow-1 flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black dark:border-strokedark dark:text-white"
                      type="button"
                      onClick={() => router.push('/dashboard')}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="button"
                      onClick={handleLogoSubmit} // Handle logo submit
                    >
                      {loading ? 'Uploading...' : 'Upload Logo'}
                    </button>
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
