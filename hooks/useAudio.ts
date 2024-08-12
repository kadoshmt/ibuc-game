import { useState, useEffect } from 'react';

export default function useAudio(url: string, loop = true) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean | null>(null); // Inicia como `null` para evitar renderização inconsistente

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newAudio = new Audio(url);
      newAudio.loop = loop;
      setAudio(newAudio);
      
      const storedPreference = localStorage.getItem('gameMusic');
      setIsPlaying(storedPreference !== null ? JSON.parse(storedPreference) : true);
    }
  }, [url, loop]);

  useEffect(() => {
    if (audio && isPlaying !== null) {
      isPlaying ? audio.play() : audio.pause();
    }
  }, [isPlaying, audio]);

  const toggle = () => {
    setIsPlaying((prev) => {
      const newValue = !prev!;
      localStorage.setItem('gameMusic', JSON.stringify(newValue));
      return newValue;
    });
  };

  const playAudio = () => {
    if (audio) {
      audio.play();
    }
  };

  useEffect(() => {
    if (audio) {
      audio.addEventListener('ended', () => setIsPlaying(false));
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [audio]);

  return { isPlaying, toggle, playAudio };
}
