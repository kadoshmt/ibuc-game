import React from 'react';
import { Rammetto_One } from 'next/font/google';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });

interface LevelSelectorProps {
  onChange: (value: number) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onChange }) => {
  const levels = [
    // { id: 1, name: 'Nível 1' },
    // { id: 2, name: 'Nível 2' },
    // { id: 3, name: 'Nível 3' },
    { id: 4, name: 'Nível 4' },
  ];

  return (
    <div>
      <label className="block mb-2 font-bold">Selecione o Nível:</label>
      <select
        className={`${rammetto.className} text-amber-600 text-xs w-full p-2 border-2 rounded-lg mb-4 bg-transparent border-amber-700 border-dashed outline-0 focus:outline-0 focus:border-dashed focus:border-amber-500`}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(parseInt(e.target.value))}
        defaultValue=""
      >
        <option value="" className='bg-orange-100' disabled>Selecione um Nível</option>
        {levels.map((level) => (
          <option key={level.id} value={level.id} className='bg-orange-100'>
            {level.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LevelSelector;
