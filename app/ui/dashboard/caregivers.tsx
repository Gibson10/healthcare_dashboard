import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { Caregiver } from '@/app/lib/definitions';
export default async function CareGivers({
  caregivers,
}: {
  caregivers: Caregiver[];
}) {
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Caregivers
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {/* NOTE: comment in this code when you get to this point in the course */}

        <div className="bg-white px-6">
          {caregivers.map((caregiver, i) => {
            return (
              <div
                key={caregiver.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <Image
                    src="https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"
                    alt={`${caregiver.name}'s profile picture`}
                    className="mr-4 rounded-full"
                    width={50}
                    height={50}
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {caregiver.name}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {caregiver.email}
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {/* {caregiver.amount} */}
                </p>
              </div>
            );
          })}
        </div>
        {/* <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div> */}
      </div>
    </div>
  );
}
