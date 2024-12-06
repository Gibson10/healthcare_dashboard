'use client';
import { useState } from 'react';

export default function Page() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-6 text-2xl font-semibold">Get reports:</h2>

      <div className="mb-6 rounded-lg border border-gray-200 p-4">
        <h3 className="mb-2 text-xl font-semibold">1. Shifts</h3>
        <p className="mb-4 text-sm text-gray-500">
          Generate a pdf report on added shifts based on a specific time period.
        </p>
        <div className="flex items-center">
          <div className="flex space-x-4">
            <div className="flex flex-col">
              <label htmlFor="start-date" className="mb-1 text-gray-600">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border px-4 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="end-date" className="mb-1 text-gray-600">
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border px-4 py-2"
              />
            </div>
          </div>
          <div className="ml-auto">
            <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
              <i className="fas fa-download"></i> Download
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 p-4">
        <h3 className="mb-2 text-xl font-semibold">2. Allocations</h3>
        <p className="mb-4 text-sm text-gray-500">
          Generate a pdf report of shift allocations based on a specific time
          period.
        </p>
        <div className="flex items-center">
          <div className="flex space-x-4">
            <div className="flex flex-col">
              <label htmlFor="start-date" className="mb-1 text-gray-600">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border px-4 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="end-date" className="mb-1 text-gray-600">
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border px-4 py-2"
              />
            </div>
          </div>
          <div className="ml-auto">
            <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
              <i className="fas fa-download"></i> Download
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 p-4">
        <h3 className="mb-2 text-xl font-semibold">2. Completed Shifts</h3>
        <p className="mb-4 text-sm text-gray-500">
          Generate a pdf report of completed shifts based on a specific time
          period.
        </p>
        <div className="flex items-center">
          <div className="flex space-x-4">
            <div className="flex flex-col">
              <label htmlFor="start-date" className="mb-1 text-gray-600">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border px-4 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="end-date" className="mb-1 text-gray-600">
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border px-4 py-2"
              />
            </div>
          </div>
          <div className="ml-auto">
            <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
              <i className="fas fa-download"></i> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
