// components/FullScreenLoader.tsx
'use client';

import Lottie from 'lottie-react';
import animationData from '@/public/map-animation.json';
import { Rammetto_One } from 'next/font/google';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });

const FullScreenLoader = () => {
  return (
    <div className={`${rammetto.className} fixed inset-0 flex items-center justify-center z-50 bg-gradient`}>
      <div className="lottie-container flex flex-col items-center">
        <Lottie 
          animationData={animationData} 
          loop={true} 
          style={{ height: '300px', width: '300px' }} 
        />
        <p className="mt-4 text-2xl text-white">Carregando... Aguarde.</p>
      </div>
      <style jsx>{`
        .bg-gradient {
          width: 100%;
          height: 100%;
          background: linear-gradient(-45deg, #ee7752, #fbc02d, #ff5722, #fbc02d);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }

        .lottie-container > p {
           text-shadow: 2px 2px  #ee7752;           
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
          
       /* Ajustes para telas menores */
        @media (max-width: 1204px) {
          .lottie-container svg {
            height: 150px;
            width: 150px;
          }

          .lottie-container > p {
            font-size: 1.3rem;
            text-shadow: 1px 1px  #ee7752;
            margin-top: 0rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FullScreenLoader;
