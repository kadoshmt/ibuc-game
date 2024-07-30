'use client';

import { useEffect, useState } from 'react';

interface Ranking {
  id: number;
  playerName: string;
  totalScore: number;
  totalTime: number;
}

export default function RankingPage() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('default');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/ranking?mode=${mode}`)
      .then((res) => res.json())
      .then((data) => {
        setRankings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar rankings:', error);
        setLoading(false);
      });
  }, [mode]);

  const handleModeChange = (mode: string) => {
    setMode(mode);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100">Carregando rankings...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative w-[800px] h-[600px] bg-white shadow-lg rounded-lg p-8 overflow-hidden">
        <h1 className="text-2xl font-bold mb-4">Ranking</h1>
        <div className="flex justify-center mb-4 space-x-4">
          <button
            onClick={() => handleModeChange('default')}
            className={`py-2 px-4 rounded ${mode === 'default' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Modo Padrão
          </button>
          <button
            onClick={() => handleModeChange('time-attack')}
            className={`py-2 px-4 rounded ${mode === 'time-attack' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Time Attack
          </button>
          <button
            onClick={() => handleModeChange('survival')}
            className={`py-2 px-4 rounded ${mode === 'survival' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Survival
          </button>
        </div>
        {rankings.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200">Posição</th>
                <th className="py-2 px-4 bg-gray-200">Nome</th>
                <th className="py-2 px-4 bg-gray-200">Pontuação</th>
                <th className="py-2 px-4 bg-gray-200">Tempo</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((ranking, index) => (
                <tr key={ranking.id} className="text-center">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{ranking.playerName}</td>
                  <td className="py-2 px-4">{ranking.totalScore}</td>
                  <td className="py-2 px-4">{ranking.totalTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center">Nenhum ranking disponível no momento.</div>
        )}
        <a href="/" className="bg-blue-500 text-white py-2 px-4 rounded mt-4 inline-block absolute bottom-4 left-1/2 transform -translate-x-1/2">
          Voltar à página inicial
        </a>
      </div>
    </div>
  );
}
