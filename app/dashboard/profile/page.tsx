'use client';
import { useState, useEffect } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete'; // Assuming you're using this for location input
// import axios from 'axios';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

import { updateProfile, fetchAgencyProfile } from '../../api/profile';
export default function UpdateProfilePage() {
  // State to store the profile data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: '',
    libraries: ['places'],
  });
  const [loading, setLoading] = useState(false);

  // Function to handle text location select for PlacesAutocomplete
  const handleSelectLocation = async (address: string) => {
    setProfileData((prev) => ({ ...prev, address: address }));
  };

  // Function to handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const agencyId = localStorage.getItem('agencyId');

    if (!agencyId) {
      console.error('No agencyId found');
      return;
    }

    fetchProfile(agencyId);
  }, []);

  const fetchProfile = async (agencyId: string) => {
    try {
      const data = await fetchAgencyProfile(agencyId);
      setProfileData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Function to submit the profile update request
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const agencyId = localStorage.getItem('agencyId');

      if (!agencyId) {
        console.error('No agencyId found');
        return;
      }
      setLoading(true);
      const response = await updateProfile(agencyId, profileData);
      console.log('Profile updated:', response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading map and location services...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-4 text-2xl font-semibold">Update Agency Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-white p-6 shadow-lg"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            placeholder="Agency Name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            placeholder="Agency Email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
            placeholder="Agency Phone"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <PlacesAutocomplete
            value={profileData.address}
            onChange={(address) =>
              setProfileData((prev) => ({ ...prev, address: address }))
            }
            onSelect={handleSelectLocation}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: 'Enter location...',
                    className:
                      'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => (
                    <div
                      {...getSuggestionItemProps(suggestion)}
                      key={suggestion.placeId}
                      className={`suggestion-item ${
                        suggestion.active ? 'bg-gray-100' : ''
                      }`}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 ${loading && 'cursor-not-allowed opacity-50'}`}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
