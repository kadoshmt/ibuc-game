'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Rammetto_One, Luckiest_Guy } from 'next/font/google';
import '@/app/styles/selectPage.css';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });
const luckiest = Luckiest_Guy({ subsets: ["latin"], weight: "400" });

interface PlayerInfoProps {
  onNext: (name: string, gender: string) => void;
  isVisible: boolean;
}

const characterOptions = [
  { gender: 'menino', image: '/boy.png', label: 'Menino' },
  { gender: 'menina', image: '/girl.png', label: 'Menina' },
  { gender: 'equipe', image: '/team.png', label: 'Equipe' },
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
    localStorage.setItem('playerName', newName);
    setName(newName);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {     
      localStorage.setItem('playerName', name);
      (e.target as HTMLInputElement).blur(); // Remove o foco do campo de entrada
    }
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

  return (
    <div className={`player-info-container block`}>
      <h1 className={`player-info-title ${luckiest.className}`}>Aventureiro(a)</h1>
      <input
        type="text"
        placeholder="Nome do Jogador"
        value={name}
        onChange={handleNameChange}
        onKeyDown={handleNameKeyPress}
        className={`player-info-input ${rammetto.className}`}
      />
      <div className="player-info-character-container">
        <button onClick={handlePrevOption} className="player-info-button pr-2">{'◄'}</button>
        <div className="player-info-character-image">
          <Image
            src={characterOptions[currentOption].image}
            alt={characterOptions[currentOption].label}
            width={400}
            height={341}
            className=""
          />
          <p className={`player-info-character-label ${rammetto.className}`}>{characterOptions[currentOption].label}</p>
        </div>
        <button onClick={handleNextOption} className="player-info-button">{'►'}</button>
      </div>
      <div className='flex mx-auto'>
      </div>
    </div>
  );
};

export default PlayerInfo;
