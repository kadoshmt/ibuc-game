'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlayerInfo from '@/components/PlayerInfo';
import LessonSelection from '@/components/LessonSelection';
import { Rammetto_One } from "next/font/google";

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });

export default function QuizSelect() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true); // Valor padrão
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
      const storedPreference = localStorage.getItem('gameMusic');
      if (storedPreference !== null) {
        setIsPlaying(JSON.parse(storedPreference));
      }
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      router.push(`/classMode/quiz/${sessionId}`);
    }
  }, [sessionId, router]);

  const handleNextStep = (name: string, gender: string) => {
    setName(name);
    setGender(gender);
    setStep(2);
  };

  const handleSelection = async (level: number, module: number, lesson: number) => {
    setLoading(true);
    const response = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ levelId: level, moduleId: module, lessonId: lesson }),
    });
    if (response.ok) {
      const { sessionId } = await response.json();
      setSessionId(sessionId);
    } else {
      console.error('Failed to create session');
      setLoading(false);
    }
  };

  const toggleMusic = () => {
    setIsPlaying((prev) => {
      const newValue = !prev;
      localStorage.setItem('gameMusic', JSON.stringify(newValue));
      return newValue;
    });
  };

  useEffect(() => {
    const audio = new Audio('/bg-selection.mp3');
    audio.loop = true;
    if (isPlaying) {
      audio.play().catch((error) => console.error('Playback prevented:', error));
    } else {
      audio.pause();
    }
    return () => {
      audio.pause();
    };
  }, [isPlaying]);

  if (!hasMounted) return null; // Evita renderizar antes de montar

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/selection-screen.webp)' }}>
      <audio id="bg-music" loop>
        <source src="/bg-selection.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="relative w-full max-w-5xl h-[600px]">
        <div className="absolute inset-0 bg-no-repeat bg-center bg-contain hidden md:block m-4" style={{ backgroundImage: 'url(/open-notebook.png)' }}></div>
        <div className={`absolute inset-0 flex flex-col md:flex-row justify-between items-center px-24  py-16 ${step === 1 ? 'md:justify-start' : 'md:justify-end'}`}>
          {loading ? (
            <div className="flex items-center justify-center h-full">Carregando...</div>
          ) : (
            <>
              <PlayerInfo onNext={handleNextStep} isVisible={step === 1} />
              <LessonSelection onSelection={handleSelection} isVisible={step === 2} />
            </>
          )}
        </div>
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 left-8 bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center border-4 border-white text-3xl"
        >
          {isPlaying ? '🔊' : '🔇'}
        </button>
      </div>
    </div>
  );
}
