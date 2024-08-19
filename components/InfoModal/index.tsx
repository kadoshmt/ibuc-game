// components/InfoModal.tsx
'use client';

import Image from 'next/image';
import Button from '@/components/Button';
import './styles.css'; // Importe o arquivo CSS

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="info-modal-overlay">
      <div className="info-modal-content">
        <div className="m-4">
          <Image
            src="/logo-ibuc.png"
            alt="IBUC Logo"
            width={118}
            height={70}
            className="info-modal-logo"
          />
        </div>
        <p className="info-modal-text">
          Este jogo foi criado para auxiliar os alunos e professores do Curso de Teologia Infantil do IBUC (Instituto Bíblico Único Caminho). 
          Você pode utilizá-lo como uma ferramenta para reforçar o aprendizado em sala de aula, ou recomendar aos alunos para que estes possam testar o seus conhecimentos 
          sobre o conteúdo aprendido em sala de aula. Este jogo utiliza som de fundo, e pode ser desativado nos botões no canto inferior, se assim preferir.
        </p>      
        <div className="flex justify-center items-center m-5">
          <Button label={'Entendi!'} onClick={onClose} width={140} height={41} fontSize='1rem' />
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
