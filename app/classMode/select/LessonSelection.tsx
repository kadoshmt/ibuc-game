'use client';

import { useState, useEffect } from 'react';
import LevelSelector from '@/app/classMode/select/LevelSelector';
import ModuleSelector from '@/app/classMode/select/ModuleSelector';
import LessonSelector from '@/app/classMode/select/LessonSelector';
import { Rammetto_One, Luckiest_Guy } from 'next/font/google';
import '@/app/styles/selectPage.css';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });
const luckiest = Luckiest_Guy({ subsets: ["latin"], weight: "400" });

interface LessonSelectionProps {
  onSelection: (level: number, module: number, lesson: number) => void;
  isVisible: boolean;
}

const LessonSelection: React.FC<LessonSelectionProps> = ({ onSelection, isVisible }) => {
  const [level, setLevel] = useState<number | null>(null);
  const [module, setModule] = useState<number | null>(null);
  const [allLessons, setAllLessons] = useState<{ id: number, name: string, moduleId: number }[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<{ id: number, name: string }[]>([]);
  const [lesson, setLesson] = useState<number | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('/api/lessons');
        const lessons = await response.json();
        setAllLessons(lessons);
      } catch (error) {
        console.error('Erro ao buscar as lições:', error);
      }
    };

    fetchLessons();
  }, []);

  const handleModuleChange = (moduleId: number) => {
    setModule(moduleId);
    filterLessonsByModule(moduleId);
  };

  const filterLessonsByModule = (moduleId: number) => {
    const lessons = allLessons.filter(lesson => lesson.moduleId === moduleId);
    setFilteredLessons(lessons);
    setLesson(null); // Resetar a seleção de lição quando o módulo é alterado
  };

  const handleSelect = () => {
    if (level !== null && module !== null && lesson !== null) {
      onSelection(level, module, lesson);
    }
  };

  // Condição para habilitar o botão
  const isButtonDisabled = level === null || module === null || lesson === null;

  return (
    <div className={`lesson-selection-container ${isVisible ? 'block' : 'hidden md:block'}`}>
      <h1 className={`lesson-selection-title ${luckiest.className}`}>Escolha a Lição</h1>
      <div className="lesson-selection-section">
        <LevelSelector onChange={setLevel} />
      </div>
      <div className="lesson-selection-section">
        <ModuleSelector onChange={handleModuleChange} />
      </div>
      <div className="lesson-selection-section">
        <LessonSelector onChange={setLesson} lessons={filteredLessons} />
      </div>
      <div className="lesson-selection-button-container">
        <button
          onClick={handleSelect}
          className={`lesson-selection-button ${rammetto.className} ${isButtonDisabled ? 'button-disabled' : ''}`}
          disabled={isButtonDisabled}
        >
          Iniciar Expedição
        </button>
      </div>
    </div>
  );
};

export default LessonSelection;
