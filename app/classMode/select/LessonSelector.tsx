import React from 'react';
import { Rammetto_One } from 'next/font/google';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });

interface LessonSelectorProps {
  onChange: (value: number) => void;
  lessons: { id: number, name: string }[];
}

const LessonSelector: React.FC<LessonSelectorProps> = ({ onChange, lessons }) => {
  return (
    <div className="selector-container">
      <label className="selector-label">Selecione a Lição:</label>
      <select
        className={`${rammetto.className} selector-select`}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(parseInt(e.target.value))}
        defaultValue=""
      >
        <option value="" className="option-default" disabled>Selecione uma Lição</option>
        {lessons.map((lesson) => (
          <option key={lesson.id} value={lesson.id} className="option-default">
            {lesson.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LessonSelector;
