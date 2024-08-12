// components/InfoModal.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border-4 border-orange-500 rounded-lg p-6 max-w-lg mx-auto text-center">
        <div className="mb-4">
          <Image
            src="/logo-ibuc.png" // Substitua com o caminho da imagem desejada
            alt="IBUC Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
        </div>
        <p className="text-gray-800 mb-6">
          Este jogo foi criado por Janes Roberto da Costa (Ad Alvorada. Cuiabá/MT) para auxiliar os alunos e professores do Curso de Teologia Infantil do IBUC (Instituto Bíblico Único Caminho). 
          Você pode utilizá-lo como uma ferramenta para reforçar o aprendizado em sala de aula, ou recomendar aos alunos para que estes possam testar o seus conhecimentos 
          sobre o conteúdo aprendido em sala de aula. Este jogo utiliza som de fundo, e pode ser desativado nos botões no canto inferior, se assim preferir.
        </p>
        <button
          onClick={onClose}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Entendi!
        </button>
      </div>
    </div>
  );
};

export default InfoModal;
