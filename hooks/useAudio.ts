import { useState, useEffect } from 'react';

export default function useAudio(url: string, loop = true, disableAutoStop = false, shouldPlay = true) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean | null>(null);

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
    if (audio && isPlaying !== null && shouldPlay) {
      isPlaying ? audio.play() : audio.pause();
    }
  }, [isPlaying, audio, shouldPlay]);

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
      const handleEnded = () => {
        if (!disableAutoStop) {
          setIsPlaying(false);
        }
      };

      audio.addEventListener('ended', handleEnded);
      return () => {
        audio.pause();
        audio.currentTime = 0;
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audio, disableAutoStop]);

  return { isPlaying, toggle, playAudio };
}
