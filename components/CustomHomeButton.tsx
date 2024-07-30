import React from 'react';

interface CustomHomeButtonProps {
  color: 'yellow' | 'green';
  text: string;
  onClick: () => void;
}

const CustomHomeButton: React.FC<CustomHomeButtonProps> = ({ color, text, onClick }) => {
  const baseClass = `homeButton homeButton-${color}`;

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
