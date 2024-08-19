// components/InfoModal.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import Button from './Button';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="p-6 max-w-xl mx-auto text-center" style={{ backgroundImage: `url(/board-wooden.png)`, backgroundSize: `cover` }}>
        <div className="m-4">
          <Image
            src="/logo-ibuc.png" // Substitua com o caminho da imagem desejada
            alt="IBUC Logo"
            width={118}
            height={70}
            className="mx-auto"
          />
        </div>
        <p className="text-white mb-4 px-4">
          Este jogo foi criado para auxiliar os alunos e professores do Curso de Teologia Infantil do IBUC (Instituto Bíblico Único Caminho). 
          Você pode utilizá-lo como uma ferramenta para reforçar o aprendizado em sala de aula, ou recomendar aos alunos para que estes possam testar o seus conhecimentos 
          sobre o conteúdo aprendido em sala de aula. Este jogo utiliza som de fundo, e pode ser desativado nos botões no canto inferior, se assim preferir.
        </p>
        {/*<button
          onClick={onClose}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Entendi!
        </button>*/} 
        <div className="flex justify-center items-center m-5"><Button label={'Entendi!'} onClick={onClose} width={140 } height={41} fontSize='1rem'/></div>
      </div>
    </div>
  );
};

export default InfoModal;
