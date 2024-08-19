'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ButtonProps {
  name?: string; // Nome do botão
  width?: number; // Tamanho (largura) do botão
  height?: number; // Tamanho (altura) do botão
  onClick: () => void; // Método a ser chamado ao clicar no botão
  label: string; // Texto a ser exibido no botão
  fontSize?: string
}

const Button: React.FC<ButtonProps> = ({ name = "default", width = 200, height = 59, onClick, label, fontSize="1.3rem" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
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
      color: `${isHovered ? `#FFFFFF` : `#FFFCD4`}`, // ou qualquer outra cor que preferir
      fontSize: `${fontSize}`, // ajuste conforme necessário
      fontWeight: 'bold', // ajuste conforme necessário
      textAlign: 'center',
      textShadow: '0px 0px 3px orange'
    }}
  >
    <span>{label}</span>
  </div>
  );
};

export default Button;
