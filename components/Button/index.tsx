'use client';

import { useState } from 'react';

interface ButtonProps {
  name?: string; // Nome do botão
  width?: number; // Tamanho (largura) do botão
  height?: number; // Tamanho (altura) do botão
  onClick: () => void; // Método a ser chamado ao clicar no botão
  label: string; // Texto a ser exibido no botão
  fontSize?: string; // Tamanho da fonte
}

const Button: React.FC<ButtonProps> = ({ name = "default", width = 200, height = 59, onClick, label, fontSize = "1.3rem" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width,
        height,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '6px',
        backgroundImage: `url(${isHovered ? `/btn-${name}-hover.png` : `/btn-${name}.png`})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: `${isHovered ? `#FFFFFF` : `#FFFCD4`}`, // Cor do texto
        fontSize: `${fontSize}`, // Tamanho da fonte
        fontWeight: 'bold', // Negrito no texto
        textAlign: 'center',
        textShadow: '0px 0px 3px orange',
        border: 'none', // Remove a borda padrão do botão
        outline: 'none', // Remove o outline padrão ao focar
      }}
    >
      {label}
    </button>
  );
};

export default Button;
