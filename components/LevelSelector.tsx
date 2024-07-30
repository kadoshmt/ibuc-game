import React from 'react';

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
        className="w-full p-2 border rounded"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(parseInt(e.target.value))}
        defaultValue=""
      >
        <option value="" disabled>Selecione um Nível</option>
        {levels.map((level) => (
          <option key={level.id} value={level.id}>
            {level.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LevelSelector;
