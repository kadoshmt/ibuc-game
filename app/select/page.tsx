'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LevelSelector from '@/components/LevelSelector';
import ModuleSelector from '@/components/ModuleSelector';
import LessonSelector from '@/components/LessonSelector';

export default function QuizSelect() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [level, setLevel] = useState<number | null>(null);
  const [module, setModule] = useState<number | null>(null);
  const [lesson, setLesson] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    const savedGender = localStorage.getItem('playerGender');
    if (savedName) setName(savedName);
    if (savedGender) setGender(savedGender);
  }, []);

  useEffect(() => {
    if (sessionId) {
      router.push(`/quiz/${sessionId}`);
    }
  }, [sessionId, router]);

  const handleNextStep = async () => {
    if (step === 1 && name) {
      localStorage.setItem('playerName', name);
      localStorage.setItem('playerGender', gender || 'nao-definido');
      setStep(2);
      setLoading(false);
    } else if (step === 2 && level !== null && module !== null && lesson !== null) {
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
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative w-[800px] h-[600px] bg-white shadow-lg rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">Carregando...</div>
        ) : (
          <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${(step - 1) * 100}%)` }}>
            <div className="w-full flex-shrink-0 p-8">
              <h1 className="text-2xl font-bold mb-4">Defina seu nome</h1>
              <input
                type="text"
                placeholder="Nome do Jogador"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <div className="mb-4">
                <label className="block mb-2 font-bold">Selecione o Gênero:</label>
                <select
                  className="w-full p-2 border rounded"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="" disabled>Selecione</option>
                  <option value="menino">Menino</option>
                  <option value="menina">Menina</option>
                  <option value="sala-de-aula-time">Sala de Aula /Time</option>
                </select>
              </div>
              <button
                onClick={handleNextStep}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Avançar
              </button>
            </div>

            <div className="w-full flex-shrink-0 p-8">
              <h1 className="text-2xl font-bold mb-4">Selecione o Quiz</h1>
              <div className="mb-4">
                <LevelSelector onChange={setLevel} />
              </div>
              <div className="mb-4">
                <ModuleSelector onChange={setModule} />
              </div>
              <div className="mb-4">
                <LessonSelector onChange={setLesson} />
              </div>
              <button
                onClick={handleNextStep}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Iniciar Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
