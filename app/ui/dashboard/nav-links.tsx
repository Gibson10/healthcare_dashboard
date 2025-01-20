'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentListIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  IdentificationIcon,
  UserIcon,
  UsersIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'FACILITIES',
    href: '/dashboard/facilities',
    icon: BuildingLibraryIcon,
  },
  {
    name: 'SHIFTS',
    href: '/dashboard/shifts',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'CAREGIVERS',
    href: '/dashboard/caregivers',
    icon: IdentificationIcon,
  },
  // {
  //   name: 'USER MANAGEMENT',
  //   href: '/dashboard/usermanagement',
  //   icon: UsersIcon,
  // },
  {
    name: 'DOCUMENT TYPES',
    href: '/dashboard/documents',
    icon: DocumentCheckIcon,
  },
  { name: 'REPORTS', href: '/dashboard/reports', icon: ChartBarIcon },
  { name: 'USER PROFILE', href: '/dashboard/profile', icon: UserIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
