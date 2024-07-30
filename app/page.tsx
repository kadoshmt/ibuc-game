'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [gameMusic, setGameMusic] = useState(true);

  useEffect(() => {
    const storedPreference = localStorage.getItem('gameMusic');
    if (storedPreference) {
      setGameMusic(JSON.parse(storedPreference));
    }
  }, []);

  useEffect(() => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      if (gameMusic) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [gameMusic]);

  const handleStart = () => {
    router.push('/select');
  };

  const handleRanking = () => {
    router.push('/ranking');
  };

  const toggleMusic = () => {
    setGameMusic(!gameMusic);
    localStorage.setItem('gameMusic', JSON.stringify(!gameMusic));
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
      <div className="text-center w-[800px] h-[200px] flex flex-col justify-between p-8">
               <div className="flex justify-center space-x-4">
          <button
            onClick={handleStart}
            className="bg-yellow-500 text-white py-2 px-4 rounded-3xl text-4xl font-semibold border-4 border-white"
          >
            Iniciar Jogo
          </button>
          <button
            onClick={handleRanking}
            className="bg-green-500 text-white py-2 px-4 rounded-3xl text-4xl font-semibold border-4 border-white"
          >
            Ranking
          </button>
          <button
            onClick={toggleMusic}
            className="bg-red-500 text-white py-2 px-4 rounded-3xl text-4xl font-semibold border-4 border-white"
          >
            {gameMusic ? 'On' : 'Off'}
          </button>
        </div>
      </div>
    </div>
  );
}
