'use client';

import { useState } from 'react';
import Image from 'next/image';

interface IconButtonProps {
  name: string; // Nome do botão
  size?: number; // Tamanho (largura e altura) do botão
  float?: 'none' | 'left' | 'right';
  floatRight?: boolean;
  onClick: () => void; // Método a ser chamado ao clicar no botão
}

const IconButton: React.FC<IconButtonProps> = ({ name, size = 84, float = 'none', onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <>       
      {(float === 'left' || float === 'right') && (
        <div className={`fixed bottom-2 ${float}-2 flex items-center justify-center`}>
          <div
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ width: size, height: size, cursor: 'pointer' }}
          >
            <Image
              src={isHovered ? `/btn-${name}-hover.png` : `/btn-${name}.png`}
              alt={name}
              width={size}
              height={size-1}
            />
          </div>
        </div>
      )}

      {float === 'none' && (
        <div
          onClick={onClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ width: size, height: size, cursor: 'pointer' }}
        >
          <Image
            src={isHovered ? `/btn-${name}-hover.png` : `/btn-${name}.png`}
            alt={name}
            width={size}
            height={size-1}
          />
        </div>
       )}
    </>
  );
};

export default IconButton;
