'use client';

import { useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { createFacility } from '../../../api/index';

export default function Page() {
  const [activeTab, setActiveTab] = useState('details');
  const [facilityName, setFacilityName] = useState('');
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [textLocation, setTextLocation] = useState('');
  const [telephone, setTelephone] = useState('');
  const [floor, setFloor] = useState('');
  const [building, setBuilding] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const agencyId = localStorage.getItem('agencyId');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAjfDfEoYLwPxFCUZ2VWUku152SV0nxAr4',
    libraries: ['places'],
  });

  if (!isLoaded) return <div>Loading...</div>;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSelect = async (address: string) => {
    console.log('Address:', address);
    setTextLocation(address);
    const results = await geocodeByAddress(address);
    console.log('Results:', results);
    const { lat, lng } = await getLatLng(results[0]);
    console.log('Lat:', lat, 'Lng:', lng);
    setLocation({ latitude: lat, longitude: lng });
  };

  // Submit the form
  const handleSubmit = async () => {
    // Validate required fields
    if (
      !facilityName.trim() ||
      !textLocation.trim() ||
      !telephone.trim() ||
      !email.trim() ||
      !description.trim() ||
      !location.latitude ||
      !location.longitude
    ) {
      toast.error('Please fill out all required fields.', {
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

    const agencyId = localStorage.getItem('agencyId');
    setLoading(true);

    const facilityData = {
      name: facilityName,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      textLocation,
      telephone,
      email,
      building,
      floor,
      description,
      agencyId,
    };

    try {
      const response = await createFacility(facilityData, selectedImage);
      console.log('Facility created:', response);
      toast.success('Facility created successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.push('/dashboard/facilities');
    } catch (error) {
      toast.error('Error creating facility!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setLoading(false);
  };

  console.log('process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', apiKey);
  console.log("localStorage.getItem('agencyId')", agencyId);

  const renderDetailsForm = () => (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="facility-name"
            className="block text-sm font-medium text-gray-700"
          >
            Name *
          </label>
          <input
            type="text"
            id="facility-name"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Facility Name"
          />
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location *
          </label>
          <PlacesAutocomplete
            value={textLocation}
            onChange={setTextLocation}
            onSelect={handleSelect}
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
                    className: 'location-search-input',
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
                    const className = suggestion.active
                      ? 'suggestion-item--active'
                      : 'suggestion-item';
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                        })}
                        key={suggestion.placeId}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
        <div>
          <label
            htmlFor="telephone"
            className="block text-sm font-medium text-gray-700"
          >
            Telephone *
          </label>
          <input
            type="text"
            id="telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Facility Phone Number"
          />
        </div>
        <div>
          <label
            htmlFor="building"
            className="block text-sm font-medium text-gray-700"
          >
            Email *
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Email"
          />
        </div>
        <div>
          <label
            htmlFor="floor"
            className="block text-sm font-medium text-gray-700"
          >
            Floor
          </label>
          <input
            type="text"
            id="floor"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Floor"
          />
        </div>
        <div>
          <label
            htmlFor="building"
            className="block text-sm font-medium text-gray-700"
          >
            Building
          </label>
          <input
            type="text"
            id="building"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Building"
          />
        </div>
      </div>
      <div className="mt-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
        ></textarea>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Facility Images *</h3>
        <div
          className="mt-2 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center"
          onClick={() => document.getElementById('fileInput')?.click()} // Trigger click on hidden file input
        >
          {selectedImage ? (
            <p>{selectedImage.name}</p> // Display the selected image name
          ) : (
            <p>Drop facility picture here to upload</p>
          )}
        </div>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          style={{ display: 'none' }} // Hide the file input
          onChange={handleImageChange} // Handle file selection
        />
      </div>
      {selectedImage && (
        <div className="mt-4">
          <h4 className="text-lg font-medium">Selected Image Preview:</h4>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected Facility"
            className="mt-2 h-40 w-40 rounded-lg object-cover"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Add Facility</h2>
        {/* <button
          onClick={handleSubmit}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        >
          Save
        </button> */}
        <button
          onClick={handleSubmit}
          disabled={loading} // Disable the button while loading
          className={`rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 ${loading && 'cursor-not-allowed opacity-50'}`}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('details')}
            className={`w-1/2 px-1 py-4 text-center text-sm font-medium ${
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } border-b-2`}
          >
            Details
          </button>
        </nav>
      </div>

      {renderDetailsForm()}
    </div>
  );
}
