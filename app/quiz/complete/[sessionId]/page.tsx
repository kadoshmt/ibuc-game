'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function QuizComplete() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [time, setTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const savedRef = useRef(false); // Ref para evitar salvamento duplicado
  const playerName = localStorage.getItem('playerName') || 'Visitante';

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch(`/api/session?id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setScore(data.score);
          setTime(data.time);
          setTotal(10); // Assumindo 10 perguntas

          if (!savedRef.current) {
            // Salvar o ranking no banco de dados
            await fetch('/api/save-results', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                playerName,
                totalScore: data.score,
                totalTime: data.time,
                mode: 'default', // Modo padrão
              }),
            });

            savedRef.current = true; // Define como salvo para evitar duplicação
          }

          setLoading(false); // Define carregamento como falso
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    };

    fetchSession();
  }, [sessionId, router, playerName]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100">Carregando...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative w-[800px] h-[600px] bg-white shadow-lg rounded-lg p-8 overflow-hidden">
        <h1 className="text-2xl font-bold mb-4">Quiz Completo!</h1>
        <p>Parabéns, {playerName}! Você completou o quiz.</p>
        <p>Sua pontuação: {score} de {total * 100}</p>
        {time !== null ? (
          <p>Tempo total: {time.toFixed(2)} segundos</p>
        ) : (
          <p>Carregando tempo...</p>
        )}
        <a href="/" className="bg-blue-500 text-white py-2 px-4 rounded mt-4 inline-block">
          Voltar à página inicial
        </a>
      </div>
    </div>
  );
}
