'use client';

import FullScreenLoader from '@/components/FullScreenLoader';
import IconButton from '@/components/IconButton';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Luckiest_Guy } from 'next/font/google';
import RotatePhone from '@/components/RotatePhone';
import '@/app/styles/rankingPage.css';

const luckiest = Luckiest_Guy({ subsets: ["latin"], weight: "400" });

interface Ranking {
  id: number;
  playerName: string;
  genre: string;
  totalScore: number;
  totalTime: number;
  media: number;
}

export default function RankingPage() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('default');
  const [background, setBackground] = useState('/bg-complete.png');
  const [board, setBoard] = useState('/board-ranking.png');  
  const router = useRouter();
  

  useEffect(() => {
    setLoading(true);
    fetch(`/api/ranking?mode=${mode}`)
      .then((res) => res.json())
      .then((data) => {
        setRankings(data.rankings);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar rankings:', error);
        setLoading(false);
      });
  }, [mode]);

  const formatTime = (time: number | null) => {
    
    if (time === null) {
      return '00:00';
    }
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes.toString();
    const secondsFormatted = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds.toString();

    return `${minutesFormatted}:${secondsFormatted}`;
  };

  const handleModeChange = (mode: string) => {
    setMode(mode);
  }; 

  const handleHome = () => {
    router.push('/');
  };

  const determineAvatarDetails = (gender: string) => {
    switch (gender) {
      case 'menino':
        return { src: '/avatar-boy.png', bgColor: 'bg-blue-500' };
      case 'menina':
        return { src: '/avatar-girl.png', bgColor: 'bg-pink-500' };
      case 'equipe':
      default:
        return { src: '/avatar-team.png', bgColor: 'bg-yellow-500' };
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Image src="/medal-gold.png" alt="Medalha 1º Lugar" width={32} height={32} className="" />
      case 2:
        return <Image src="/medal-silver.png" alt="Medalha 2º Lugar" width={32} height={32} className="" />
      case 3:
        return <Image src="/medal-bronze.png" alt="Medalha 3º Lugar" width={32} height={32} className="" />
      default:
        return ;
    }
  };

  if (loading) return <FullScreenLoader />;

  

  return (
    <>
      <RotatePhone />
      <div className={`ranking-page-container ${luckiest.className}`}>
        <div className="ranking-content-wrapper">
          <div className="ranking-content">
            <h1 className="hidden">Ranking</h1>
            <div className="ranking-table-container">
              {rankings && rankings.length > 0 ? (
                <div className="ranking-table-wrapper"> 
                  <table className="ranking-table">
                    <tbody>
                      {rankings.map((ranking, index) => (
                        <tr key={ranking.id} className={`ranking-table-row ${index % 2 === 0 ? 'ranking-table-row-odd' : 'ranking-table-row-even'}`}>
                          <td className="ranking-table-cell-icon">{getPositionIcon(index + 1)}</td>
                          <td className="ranking-table-cell-rank">{index + 1}º</td>
                          <td className="ranking-table-cell-avatar">
                            <div className="ranking-table-cell-avatar-inner">
                              <div className={`ranking-table-avatar ${determineAvatarDetails(ranking.genre).bgColor}`}>
                                <Image src={determineAvatarDetails(ranking.genre).src} alt="Avatar" width={44} height={44} className="rounded-full" />
                              </div>
                              <div className="ranking-table-cell-name">{ranking.playerName}</div>
                            </div>
                          </td>
                          <td className="ranking-table-cell-score">
                            <div className="ranking-table-cell-score-inner">
                              <Image src="/coin-star.png" alt="Pontos" width={32} height={32} className="rounded-full" />
                              <div className="ranking-table-cell-score-text">{ranking.totalScore}</div>
                            </div>
                          </td>
                          <td className="ranking-table-cell-time">
                            <div className="ranking-table-cell-time-inner">
                              <Image src="/clock.png" alt="Tempo" width={32} height={32} className="rounded-full" />
                              <div className="ranking-table-cell-time-text">{formatTime(ranking.totalTime)}</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="ranking-empty-label">Nenhum ranking disponível no momento.</div>
              )}
            </div>
          </div>
        </div>
          <IconButton name="home" size={72} onClick={handleHome} float='right' />
      </div>
    </>
  );
}