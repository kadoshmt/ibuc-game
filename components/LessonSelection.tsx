'use client';

import { useState } from 'react';
import LevelSelector from '@/components/LevelSelector';
import ModuleSelector from '@/components/ModuleSelector';
import LessonSelector from '@/components/LessonSelector';
import { Rammetto_One, Luckiest_Guy } from 'next/font/google';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });
const luckiest = Luckiest_Guy({ subsets: ["latin"], weight: "400" });


interface LessonSelectionProps {
  onSelection: (level: number, module: number, lesson: number) => void;
  isVisible: boolean;
}

const LessonSelection: React.FC<LessonSelectionProps> = ({ onSelection, isVisible }) => {
  const [level, setLevel] = useState<number | null>(null);
  const [module, setModule] = useState<number | null>(null);
  const [lesson, setLesson] = useState<number | null>(null);

  const handleSelect = () => {
    if (level !== null && module !== null && lesson !== null) {
      onSelection(level, module, lesson);
    }
  };

  return (
    <div className={`w-full md:w-1/2 p-8 pr-16 ${isVisible ? 'block' : 'hidden md:block'}`}>
      <h1 className={`${luckiest.className} text-3xl text-amber-900 font-bold mb-8 text-center`}>Escolha a Lição</h1>
      <div className="mb-4">
        <LevelSelector onChange={setLevel} />
      </div>
      <div className="mb-4">
        <ModuleSelector onChange={setModule} />
      </div>
      <div className="mb-4">
        <LessonSelector onChange={setLesson} />
      </div>
      <div className='text-center'>
      <button
        onClick={handleSelect}
        className={`${rammetto.className} bg-amber-900 text-white py-2 px-4 rounded-lg`}
      >
        Iniciar Quiz
      </button>
      </div>
    </div>
  );
};

export default LessonSelection;
