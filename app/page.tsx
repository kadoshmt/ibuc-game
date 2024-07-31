'use client';

import CustomHomeButton from '@/components/CustomHomeButton';
import { Rammetto_One } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const router = useRouter();
  const [gameMusic, setGameMusic] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPreference = localStorage.getItem('gameMusic');
      if (storedPreference !== null) {
        setGameMusic(JSON.parse(storedPreference));
      } else {
        setGameMusic(true);
        localStorage.setItem('gameMusic', JSON.stringify(true));
      }
    }
  }, []);

  useEffect(() => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio && gameMusic) {
      const playAudio = async () => {
        try {
          await audio.play();
        } catch (error) {
          console.error('Audio playback failed:', error);
        }
      };
      playAudio();
    }
  }, [gameMusic]);

  const handleStart = () => {
    router.push('/select');
  };

  const handleRanking = () => {
    router.push('/ranking');
  };

  const toggleMusic = () => {
    setGameMusic((prev) => {
      const newValue = !prev;
      localStorage.setItem('gameMusic', JSON.stringify(newValue));
      return newValue;
    });
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
            onClick={handleStart}
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
        onClick={toggleMusic}
        className="fixed bottom-8 left-8 bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center border-4 border-white text-3xl"
      >
        {gameMusic ? '🔊' : '🔇'}
      </button>
    </div>
  );
}
