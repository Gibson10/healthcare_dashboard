'use client'; // Mark the component as a client component

import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
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
};

export default withAuth;
