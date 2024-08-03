'use client';

import CustomHomeButton from '@/components/CustomHomeButton';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAudio from '@/hooks/useAudio';


export default function Home() {
  const router = useRouter();
  const { isPlaying, toggle } = useAudio('/bg-home.mp3');

  const handleStartClassMode = () => {
    router.push('/classMode/select');
  };

  const handleRanking = () => {
    router.push('/ranking');
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url(/home-screen.webp)' }}
    >
      <audio id="bg-music" loop>
        <source src="/bg-home.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="text-center w-[800px] h-[600px] flex flex-col p-8">
        <div className="flex justify-center mb-8">
          <Image
            src="/game-title.png"
            width={600}
            height={255}
            alt="Game Title"
            className="w-[600px] h-[255px]"
          />
        </div>
        <div className="flex justify-center space-x-4">
          {/* <button
            onClick={handleStart}
            className={`${rammetto.className} bg-yellow-500 text-white py-2 px-4 rounded-3xl text-2xl  border-4 border-white`}
          >
            Iniciar Jogo
          </button> */}
          <CustomHomeButton
            color="yellow"
            text="Iniciar Jogo"
            onClick={handleStartClassMode}
          />
        </div>
      </div>
      <button
        onClick={handleRanking}
        className="fixed bottom-8 right-8 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center border-4 border-white text-3xl"
      >
        🏆
      </button>
      
      <button
        onClick={toggle}
        className="fixed bottom-8 left-8 bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center border-4 border-white text-3xl"
      >
         {isPlaying ? '🔊' : '🔇'}
      </button>
    </div>
  );
}
