'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlayerInfo from '@/components/PlayerInfo';
import LessonSelection from '@/components/LessonSelection';
import FullScreenLoader from '@/components/FullScreenLoader';
import { Rammetto_One } from "next/font/google";
import useAudio from '@/hooks/useAudio';
import IconButton from '@/components/IconButton';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });

export default function QuizSelect() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true); // Inicia como true para exibir o loader
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { isPlaying, toggle } = useAudio('/bg-selection.mp3', true, true, !loading);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
    setLoading(false); // Desativa o carregamento inicial
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

  const handleHome = () => {
    router.push('/');
  };

  if (!hasMounted || loading) return <FullScreenLoader />; // Exibe o loader até que a página esteja montada e os dados carregados

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/selection-screen.webp)' }}>
      <div className="relative w-full max-w-5xl h-[630px]">
        <div className="absolute inset-0 bg-no-repeat bg-center bg-contain hidden md:block m-4" style={{ backgroundImage: 'url(/open-notebook.png)' }}></div>
        <div className={`absolute inset-0 flex flex-col md:flex-row justify-between items-center px-20 py-16 ${step === 1 ? 'md:justify-start' : 'md:justify-end'}`}>
          <PlayerInfo onNext={handleNextStep} isVisible={step === 1} />
          <LessonSelection onSelection={handleSelection} isVisible={step === 2} />
        </div>
        {/* {isPlaying !== null && (
          <button
            onClick={toggle}
            className="fixed bottom-8 left-8 bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center border-4 border-white text-3xl"
          >
            {isPlaying ? '🔊' : '🔇'}
          </button>
        )}
        <button
          onClick={handleHome}
          className="fixed bottom-8 right-8 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center border-4 border-white text-3xl"
        >
          🏠
        </button> */}

        {isPlaying !== null && (
          <div className="fixed bottom-8 left-8 flex items-center justify-center">
            {isPlaying ? <IconButton name="music-on" size={72} onClick={toggle} /> : <IconButton name="music-off" size={72} onClick={toggle} />}
          </div>
        )}

      <div className="fixed bottom-8 right-8 flex items-center justify-center">
        <IconButton name="home" size={72} onClick={handleHome} />
      </div>
      </div>
    </div>
  );
}
