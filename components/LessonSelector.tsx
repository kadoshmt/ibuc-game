import React from 'react';
import { Rammetto_One } from 'next/font/google';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });

interface LessonSelectorProps {
  onChange: (value: number) => void;
  lessons: { id: number, name: string }[];
}

const LessonSelector: React.FC<LessonSelectorProps> = ({ onChange, lessons }) => {
  return (
    <div>
      <label className="block mb-2 font-bold">Selecione a Lição:</label>
      <select
        className={`${rammetto.className} text-amber-600 text-xs w-full p-2 border-2 rounded-lg mb-4 bg-transparent border-amber-700 border-dashed outline-0 focus:outline-0 focus:border-dashed focus:border-amber-500`}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(parseInt(e.target.value))}
        defaultValue=""
      >
        <option value="" className='bg-orange-100' disabled>Selecione uma Lição</option>
        {lessons.map((lesson) => (
          <option key={lesson.id} value={lesson.id} className='bg-orange-100'>
            {lesson.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LessonSelector;
