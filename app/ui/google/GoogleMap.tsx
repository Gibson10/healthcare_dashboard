'use client';

import {
  GoogleMap,
  LoadScript,
  useLoadScript,
  Marker,
} from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '500px' };
const libraries = ['places']; // Include necessary libraries

export default function Map({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAjfDfEoYLwPxFCUZ2VWUku152SV0nxAr4',
    libraries: ['places'],
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={{ lat: latitude, lng: longitude }}
      zoom={14}
    >
      <Marker position={{ lat: latitude, lng: longitude }} />
    </GoogleMap>
  );
}
