import React from 'react';
import { Rammetto_One } from 'next/font/google';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });

interface LessonSelectorProps {
  onChange: (value: number) => void;
}

const LessonSelector: React.FC<LessonSelectorProps> = ({ onChange }) => {
  const lessons = [
    { id: 1, name: '01 - O que é a Bíblia' },
    { id: 2, name: '02 - A Bíblia é um livro?' },
    { id: 3, name: '03 - A Bíblia foi escrita em que idioma?' },
    { id: 4, name: '04 - Por que a minha Bíblia parece ser diferente?' },
    { id: 5, name: '05 - A Bíblia está em ordem cronológica?' },
    { id: 6, name: '06 - O Antigo Testamento' },
    { id: 7, name: '07 - O grande exemplo de Deus' },
    { id: 8, name: '08 - O Novo Testamento' },
    { id: 9, name: '09 - Qual o objetivo da Bíblia?' },
    { id: 10, name: '10 - Quem é Jesus?' },
    { id: 11, name: '11 - Provas Bíblicas que Jesus é Deus' },
    { id: 12, name: '12 - Jesus, o caminho, a verdade e a vida' },
  ];

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
