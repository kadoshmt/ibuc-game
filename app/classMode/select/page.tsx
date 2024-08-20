'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlayerInfo from '@/app/classMode/select/PlayerInfo';
import LessonSelection from '@/app/classMode/select/LessonSelection';
import FullScreenLoader from '@/components/FullScreenLoader';
import useAudio from '@/hooks/useAudio';
import IconButton from '@/components/IconButton';
import '@/app/styles/selectPage.css';
import RotatePhone from '@/components/RotatePhone';

export default function QuizSelect() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { isPlaying, toggle } = useAudio('/bg-selection.mp3', true, true, !loading);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
    setLoading(false); 
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

  if (!hasMounted || loading) return <FullScreenLoader />;


  return (
    <>
      <RotatePhone />
      <div className="quiz-select-container">
        <div className="quiz-select-content">
          <div className="notebook-background"></div>
          <div className={`quiz-select-inner ${step === 1 ? 'justify-start' : 'justify-end'}`}>
            <PlayerInfo onNext={handleNextStep} isVisible={true} />
            <LessonSelection onSelection={handleSelection} isVisible={true} />
          </div>      
          {isPlaying !== null && (
              <IconButton name={`${isPlaying ? "music-on": "music-off"}`} size={72} onClick={toggle} float='left' />
          )}

          <IconButton name="home" size={72} onClick={handleHome} float='right' />
        </div>
      </div>
    </>
  );
}
