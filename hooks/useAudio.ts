// useAudio.tsx
import { useEffect, useState, useRef } from 'react';

const useAudio = (src: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [src]);

  useEffect(() => {
    const handlePlay = async () => {
      try {
        if (isPlaying && audioRef.current) {
          await audioRef.current.play();
        } else if (!isPlaying && audioRef.current) {
          audioRef.current.pause();
        }
      } catch (error) {
        console.error('Audio playback failed:', error);
      }
    };

    handlePlay();
  }, [isPlaying]);

  const toggle = () => setIsPlaying((prev) => !prev);

  return { isPlaying, toggle };
};

export default useAudio;
