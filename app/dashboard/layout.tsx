'use client'; // Mark this layout as a client component if needed

import SideNav from '@/app/ui/dashboard/sidenav';
import withAuth from '@/app/lib/auth/withAuth'; // Import the HOC
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}

export default withAuth(Layout); // Wrap the layout with withAuth
