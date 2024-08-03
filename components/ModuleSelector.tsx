import React from 'react';
import { Rammetto_One } from 'next/font/google';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });

interface ModuleSelectorProps {
  onChange: (value: number) => void;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({ onChange }) => {
  const modules = [
    { id: 1, name: '1 - Entendendo a Bíblia' },
    { id: 2, name: '2 - Descobrindo o Pentateuco' },
    { id: 3, name: '3 - Exporando as Terras Bíblicas' },
    { id: 4, name: '4 - Vivenciando a História' },
    { id: 5, name: '5 - Aprendendo com os Poetas' },
    { id: 6, name: '6 - Aprendendo com os Profetas' },
    { id: 7, name: '7 - Caminhando com Jesus' },
    { id: 8, name: '8 - Conhecendo a Igreja Primitiva' },
    { id: 9, name: '9 - Compreendendo os Princípios Cristãos' },
    { id: 10, name: '10 - Desvendando o Futuro' },
  ];

  return (
    <div>
      <label className="block mb-2 font-bold">Selecione o Módulo:</label>
      <select
        className={`${rammetto.className} text-amber-600 text-xs w-full p-2 border-2 rounded-lg mb-4 bg-transparent border-amber-700 border-dashed outline-0 focus:outline-0 focus:border-dashed focus:border-amber-500`}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(parseInt(e.target.value))}
        defaultValue=""
      >
        <option value="" className='bg-orange-100' disabled>Selecione um Módulo</option>
        {modules.map((module) => (
          <option key={module.id} value={module.id} className='bg-orange-100'>
            {module.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModuleSelector;
