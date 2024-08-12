"use client";

import { useState, useEffect } from 'react';
import FullScreenLoader from '@/components/FullScreenLoader';

const ClientLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
};

export default ClientLoader;
