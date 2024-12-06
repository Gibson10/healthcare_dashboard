'use client'; // Mark this layout as a client component
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchFacilities } from '../../api/facilities'; // Import your fetch function

export default function Page() {
  const [facilities, setFacilities] = useState<any[]>([]); // State to store fetched facilities
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for errors

  // Fetch facilities when the component is mounted
  useEffect(() => {
    const getFacilities = async () => {
      const agencyId = localStorage.getItem('agencyId');

      if (!agencyId) {
        console.error('No agencyId found');
        return;
      }

      try {
        const data = await fetchFacilities(agencyId); // Fetch facilities
        setFacilities(data); // Set the fetched facilities in state
        setLoading(false); // Turn off loading
      } catch (err) {
        setError('Failed to fetch facilities');
        setLoading(false);
      }
    };

    getFacilities();
  }, []);

  if (loading) {
    return <p>Loading facilities...</p>; // Show loading message
  }

  if (error) {
    return <p>{error}</p>; // Show error message if failed to fetch
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Facilities</h2>
        <Link
          href="/dashboard/facilities/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
            + Add facility
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                ID
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Facility
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Telephone
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Location
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Floor
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Building
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((facility, index) => (
              <tr key={facility._id}>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  {index + 1}
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  {facility.name}
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  {facility.phone}
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  {facility.textLocation ||
                    `${facility.location.latitude}, ${facility.location.longitude}`}
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  {facility.floor || 'N/A'}
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  {facility.buildingName || 'N/A'}
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  <Link href={`/dashboard/facilities/edit/${facility._id}`}>
                    <button className="mr-2 text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                  </Link>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="xs:flex-row xs:justify-between flex flex-col items-center border-t bg-white px-5 py-5">
          <span className="xs:text-sm text-xs text-gray-900">
            Showing {facilities.length} facilities
          </span>
          <div className="xs:mt-0 mt-2 inline-flex">
            <button className="rounded-l bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-400">
              Previous
            </button>
            <button className="rounded-r bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-400">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
