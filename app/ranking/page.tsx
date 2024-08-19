'use client';

import FullScreenLoader from '@/components/FullScreenLoader';
import IconButton from '@/components/IconButton';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Luckiest_Guy } from 'next/font/google';

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
    <div className={`${luckiest.className} text-orange-700 flex items-center justify-center h-screen`} style={{ backgroundImage: `url(${background})` }}>
      <div className="relative w-[900px] h-[676px]  rounded-lg p-8 overflow-hidden" style={{ backgroundImage: `url(${board})` }} >
        <h1 className="text-2xl font-bold mb-4 hidden">Ranking</h1>
        <div className='mt-32 px-6'>
        
        {rankings.length > 0 ? (
          
          <div className="max-h-[440px] overflow-y-auto px-2"> 
            <table className="min-w-full">
             
              <tbody>
                {rankings.map((ranking, index) => (
                  
                  <tr key={ranking.id} className={`text-center bg-amber-700 ${index % 2 === 0 ? ' bg-opacity-5' : 'bg-opacity-0'}`}>
                    <td className="pl-4">{getPositionIcon(index + 1)}</td>
                    <td className="py-2 text-3xl">{index + 1}º</td>
                    <td className="py-2  ">
                      <div className='flex items-center gap-3'>
                        <div className={`rounded-full shadow-lg ${determineAvatarDetails(ranking.genre).bgColor} border-4 border-orange-700 w-[48px] h-[48px]`}>
                          <Image src={determineAvatarDetails(ranking.genre).src} alt="Avatar" width={44} height={44} className="rounded-full" />                      
                        </div>
                        <div className='text-xl '>{ranking.playerName}</div>    
                      </div>                    
                    </td>
                    <td className="py-2 text-2xl">  
                      <div className='flex items-center gap-1'>                    
                        <Image src="/coin-star.png" alt="Pontos" width={32} height={32} className="rounded-full" />                      
                        <div className='text-xl'>{ranking.totalScore}</div> 
                      </div>     
                    </td>
                    <td className="py-2">
                      <div className='flex items-center gap-1'>                    
                        <Image src="/clock.png" alt="Pontos" width={32} height={32} className="rounded-full" />                      
                        <div className='text-xl'>{formatTime(ranking.totalTime)}</div> 
                      </div>     
                    </td>
                    {/*<td className="py-2">
                    {ranking.media}   
                    </td>*/}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">Nenhum ranking disponível no momento.</div>
        )}
        </div>
       
      </div>
      <div className="fixed bottom-8 right-8 flex items-center justify-center">
        <IconButton name="home" size={72} onClick={handleHome} />
      </div>
    </div>
  );
}
