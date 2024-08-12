// app/page.tsx
'use client';

import { useState } from 'react';
import CustomHomeButton from '@/components/CustomHomeButton';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAudio from '@/hooks/useAudio';
import InfoModal from '@/components/InfoModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(true); // Controla a visibilidade do modal
  const router = useRouter();
  const { isPlaying, toggle, playAudio } = useAudio('/bg-home.mp3', true);

  const handleStartClassMode = () => {
    router.push('/classMode/select');
  };

  const handleRanking = () => {
    router.push('/ranking');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (isPlaying) {
      playAudio(); // Toca a música quando o modal for fechado e a música estiver ativada
    }
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

      <InfoModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
