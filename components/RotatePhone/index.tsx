'use client';

import Lottie from 'lottie-react';
import animationData from '@/public/rotate-phone-animation.json';
import { Rammetto_One } from 'next/font/google';
import { useEffect, useState } from 'react';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });

const RotatePhone = () => {
  const [showRotatePrompt, setShowRotatePrompt] = useState(false);

  const handleOrientationChange = () => {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    setShowRotatePrompt(isPortrait);
  };

  useEffect(() => {
    handleOrientationChange(); // Check on component mount

    window.addEventListener('resize', handleOrientationChange); // Listen for orientation changes

    return () => {
      window.removeEventListener('resize', handleOrientationChange); // Cleanup listener on unmount
    };
  }, []);

  if (!showRotatePrompt) return null;

  return (
    <div className={`${rammetto.className} fixed inset-0 flex items-center justify-center z-50 bg-gradient`}>
      <div className="flex flex-col items-center">
        <Lottie 
          animationData={animationData} 
          loop={true} 
          style={{ height: '300px', width: '300px' }} 
        />
        <p className=" text-center text-gray-800">Coloque o dispositivo em modo paisagem.</p>
      </div>
      <style jsx>{`
        .bg-gradient {
          width: 100%;
          height: 100%;
          background: linear-gradient(-45deg, #ffffff, #eeeeee, #ffffff, #eeeeee);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default RotatePhone;
