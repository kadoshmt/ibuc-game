// app/page.tsx
'use client';

import { useState } from 'react';
import CustomHomeButton from '@/components/CustomHomeButton';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAudio from '@/hooks/useAudio';
import InfoModal from '@/components/InfoModal';
import IconButton from '@/components/IconButton';
import Button from '@/components/Button';

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
          {/*<CustomHomeButton
            color="yellow"
            text="Iniciar Aventura"
            onClick={handleStartClassMode}
          />*/} 
          <Button onClick={handleStartClassMode} label={'Iniciar Aventura'} />
        </div>
      </div>
      
      <div className="fixed bottom-8 left-8 flex items-center justify-center">
        {isPlaying ? <IconButton name="music-on" size={72} onClick={toggle} /> : <IconButton name="music-off" size={72} onClick={toggle} />}
      </div>

      <div className="fixed bottom-8 right-8 flex items-center justify-center">
        <IconButton name="ranking" size={72} onClick={handleRanking} />
      </div>

      <InfoModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
