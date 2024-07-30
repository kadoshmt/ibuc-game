import React from 'react';

interface ModuleSelectorProps {
  onChange: (value: number) => void;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({ onChange }) => {
  const modules = [
    { id: 1, name: '1 - Entendendo a Bíblia' },
    // { id: 2, name: '2 - Descobrindo o Pentateuco' },
    // { id: 3, name: '3 - Exporando as Terras Bíblicas' },
    // { id: 4, name: '4 - Vivenciando a História' },
    // { id: 5, name: '5 - Aprendendo com os Poetas' },
    // { id: 6, name: '6 - Aprendendo com os Profetas' },
    // { id: 7, name: '7 - Caminhando com Jesus' },
    // { id: 8, name: '8 - Conhecendo a Igreja Primitiva' },
    // { id: 9, name: '9 - Compreendendo os Princípios Cristãos' },
    // { id: 10, name: '10 - Desvendando o Futuro' },
  ];

  return (
    <div>
      <label className="block mb-2 font-bold">Selecione o Módulo:</label>
      <select
        className="w-full p-2 border rounded"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(parseInt(e.target.value))}
        defaultValue=""
      >
        <option value="" disabled>Selecione um Módulo</option>
        {modules.map((module) => (
          <option key={module.id} value={module.id}>
            {module.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModuleSelector;
