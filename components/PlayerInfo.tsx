'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Rammetto_One, Luckiest_Guy } from 'next/font/google';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });
const luckiest = Luckiest_Guy({ subsets: ["latin"], weight: "400" });

interface PlayerInfoProps {
  onNext: (name: string, gender: string) => void;
  isVisible: boolean;
}

const characterOptions = [
  { gender: 'menino', image: '/boy.png', label: 'Menino' },
  { gender: 'menina', image: '/girl.png', label: 'Menina' },
  { gender: 'sala-de-aula-time', image: '/team.png', label: 'Sala de Aula /Time' },
];

const PlayerInfo: React.FC<PlayerInfoProps> = ({ onNext, isVisible }) => {
  const [name, setName] = useState('');
  const [currentOption, setCurrentOption] = useState(0);

  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    const savedGender = localStorage.getItem('playerGender');
    if (savedName) setName(savedName);
    if (savedGender) {
      const initialOption = characterOptions.findIndex(option => option.gender === savedGender);
      setCurrentOption(initialOption !== -1 ? initialOption : 0);
    }
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    localStorage.setItem('playerName', newName);
  };

  const handleNextOption = () => {
    const newOption = (currentOption + 1) % characterOptions.length;
    setCurrentOption(newOption);
    localStorage.setItem('playerGender', characterOptions[newOption].gender);
  };

  const handlePrevOption = () => {
    const newOption = (currentOption - 1 + characterOptions.length) % characterOptions.length;
    setCurrentOption(newOption);
    localStorage.setItem('playerGender', characterOptions[newOption].gender);
  };

  const handleNext = () => {
    if (name) {
      localStorage.setItem('playerName', name);
      localStorage.setItem('playerGender', characterOptions[currentOption].gender);
      onNext(name, characterOptions[currentOption].gender);
    }
  };

  return (
    <div className={`w-full md:w-1/2 p-8 pr-14 ${isVisible ? 'block' : 'hidden md:block'}`}>
      <h1 className={`${luckiest.className} text-3xl text-amber-900 font-bold text-center shadow-inner rounded-lg p-1`}>Aventureiro(a)</h1>
      <input
        type="text"
        placeholder="Nome do Jogador"
        value={name}
        onChange={handleNameChange}
        className={`${rammetto.className} text-red-700 text-center w-full p-2 border-2 rounded-lg mt-8 mb-4 bg-transparent border-amber-700 border-dashed outline-0 focus:outline-0 focus:border-dashed focus:border-amber-500`}
      />
      <div className="flex justify-center items-center mt-8 mb-4">
        <button onClick={handlePrevOption} className="text-3xl text-amber-900 pr-2">{'◄'}</button>
        <div className=" text-center">
          <Image
            src={characterOptions[currentOption].image}
            alt={characterOptions[currentOption].label}
            width={400}
            height={341}
            className=""
          />
          <p className={`${rammetto.className} mt-2 text-1xl text-amber-900`}>{characterOptions[currentOption].label}</p>
        </div>
        <button onClick={handleNextOption} className="text-3xl  text-amber-900">{'►'}</button>
      </div>
      <div className='flex mx-auto'>
        <button
          onClick={handleNext}
          className="block md:hidden bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Avançar
        </button>
      </div>
    </div>
  );
};

export default PlayerInfo;
