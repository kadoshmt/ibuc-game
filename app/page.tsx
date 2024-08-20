'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAudio from '@/hooks/useAudio';
import InfoModal from '@/components/InfoModal';
import IconButton from '@/components/IconButton';
import Button from '@/components/Button';
import '@/app/styles/homePage.css';
import RotatePhone from '@/components/RotatePhone';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(true); // Controla a visibilidade do modal
  const router = useRouter();
  const { isPlaying, toggle, playAudio } = useAudio('/bg-home.mp3', true);

  // Função para solicitar o modo fullscreen
  const requestFullscreen = () => {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) { // Safari
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) { // Firefox
      (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) { // IE/Edge
      (element as any).msRequestFullscreen();
    }
  };

  const handleStartClassMode = () => {
    requestFullscreen(); // Solicita o modo fullscreen ao iniciar a aventura
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
    <>
      <RotatePhone />
      <div
        className="home-container"
        style={{ backgroundImage: 'url(/home-screen.webp)' }}
      >
        <audio id="bg-music" loop>
          <source src="/bg-home.mp3" type="audio/mpeg" />
          Seu navegador não suporta elementos de audio.
        </audio>
        <div className="home-content">
          <div className="home-title">
            <Image
              src="/game-title.png"
              width={600}
              height={255}
              alt="Game Title" 
              className="responsiveLogo"
            />
          </div>
          <div className="home-button-group">
            <Button onClick={handleStartClassMode} label={'Iniciar Aventura'} />
          </div>
        </div>
        
        <div className="home-music-control">
          {isPlaying ? <IconButton name="music-on" size={72} onClick={toggle} /> : <IconButton name="music-off" size={72} onClick={toggle} />}
        </div>

        <div className="home-ranking-control">
          <IconButton name="ranking" size={72} onClick={handleRanking} />
        </div>

        <InfoModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </>
  );
}
