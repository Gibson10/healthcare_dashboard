'use client'; // Mark the component as a client component

import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
      } else {
        setIsAuthenticated(true);
      }
    }, []);

    if (!isAuthenticated) {
      return null; // Optionally, show a loading spinner here
    }

    return <WrappedComponent {...props} />;
  };

  // Assign a display name for easier debugging
  AuthenticatedComponent.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

  return AuthenticatedComponent;
};

// Helper function to determine the display name of the wrapped component
const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default withAuth;
