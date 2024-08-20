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
    <div className="selector-container">
      <label className="selector-label">Selecione o Nível:</label>
      <select
        className={`${rammetto.className} selector-select`}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(parseInt(e.target.value))}
        defaultValue=""
      >
        <option value="" className="option-default" disabled>Selecione um Nível</option>
        {levels.map((level) => (
          <option key={level.id} value={level.id} className="option-default">
            {level.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LevelSelector;
