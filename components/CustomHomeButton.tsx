import React from 'react';
import { Rammetto_One } from 'next/font/google';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });

interface CustomHomeButtonProps {
  color: 'yellow' | 'green';
  text: string;
  onClick: () => void;
}

const CustomHomeButton: React.FC<CustomHomeButtonProps> = ({ color, text, onClick }) => {
  const baseClass = `${rammetto.className} homeButton homeButton-${color}`;

  return (
    <button
      onClick={onClick}
      className={baseClass}
    >
      {text}
    </button>
  );
};

export default CustomHomeButton;
