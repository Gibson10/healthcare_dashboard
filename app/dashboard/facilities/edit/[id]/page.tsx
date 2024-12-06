'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useParams } from 'next/navigation';

import { toast, ToastContainer } from 'react-toastify';
import { fetchFacilityById, updateFacility } from '../../../../api/index';

export default function EditFacilityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const facilityId = params.id;

  const [facilityData, setFacilityData] = useState({
    name: '',
    location: { latitude: 0, longitude: 0 },
    textLocation: '',
    phone: '',
    floor: '',
    buildingName: '',
    email: '',
    description: '',
    picture: '',
  });

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAjfDfEoYLwPxFCUZ2VWUku152SV0nxAr4',
    libraries: ['places'],
  });

  useEffect(() => {
    const getFacilityData = async () => {
      try {
        const data = await fetchFacilityById(facilityId as string);
        console.log('data', data);
        setFacilityData(data);
      } catch (err) {
        toast.error('Failed to load facility data');
      }
    };

    if (facilityId) getFacilityData();
  }, [facilityId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSelectLocation = async (address: string) => {
    setFacilityData((prev) => ({ ...prev, textLocation: address }));
    const results = await geocodeByAddress(address);
    const { lat, lng } = await getLatLng(results[0]);
    setFacilityData((prev) => ({
      ...prev,
      location: { latitude: lat, longitude: lng },
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFacilityData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log('facilityData', facilityData);
      const response = await updateFacility(
        facilityId as string,
        facilityData,
        selectedImage,
      );

      toast.success('Facility updated successfully');
      router.push('/dashboard/facilities');
    } catch (error) {
      toast.error('Error updating facility');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading map and location services...</div>;
  }

  return (
    <div>
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Edit Facility</h2>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 ${loading && 'cursor-not-allowed opacity-50'}`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={facilityData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Facility Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <PlacesAutocomplete
                value={facilityData.textLocation}
                onChange={(address) =>
                  setFacilityData((prev) => ({
                    ...prev,
                    textLocation: address,
                  }))
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
                          className={`suggestion-item ${suggestion.active ? 'bg-gray-100' : ''}`}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telephone
              </label>
              <input
                type="text"
                name="telephone"
                value={facilityData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Facility Phone Number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={facilityData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Floor
              </label>
              <input
                type="text"
                name="floor"
                value={facilityData.floor}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Floor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Building
              </label>
              <input
                type="text"
                name="building"
                value={facilityData.buildingName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Building"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={facilityData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                rows={3}
              ></textarea>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Facility Image</h3>
              <div
                className="mt-2 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                {selectedImage ? (
                  <p>{selectedImage.name}</p>
                ) : (
                  <p>Drop files here to upload</p>
                )}
              </div>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
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
          {facilityData.picture && (
            <div className="mt-4">
              <h4 className="text-lg font-medium">Current Facility Image:</h4>
              <img
                src={facilityData.picture}
                alt="Facility"
                className="mt-2 h-40 w-40 rounded-lg object-cover"
              />
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
