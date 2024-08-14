'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Confetti from '@/components/Confetti';
import FullScreenLoader from '@/components/FullScreenLoader';
import useAudio from '@/hooks/useAudio';
import Image from 'next/image';
import { Luckiest_Guy } from 'next/font/google';
import IconButton from '@/components/IconButton'; // Importe o novo componente de botão

const luckiest = Luckiest_Guy({ subsets: ["latin"], weight: "400" });

export default function QuizComplete() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [time, setTime] = useState<number | null>(null);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [background, setBackground] = useState('/board-win.png');
  const [stars, setStars] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState('/bg-victory.mp3');
  const { isPlaying, toggle } = useAudio(audioUrl, false, true, !loading);
  const savedRef = useRef(false);
  const playerName = typeof window !== 'undefined' ? localStorage.getItem('playerName') || 'Visitante' : 'Visitante';
  const playerGender = typeof window !== 'undefined' ? localStorage.getItem('playerGender') || 'menino' : 'menino';

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

  const formatTime = (time: number | null) => {
    if (time === null) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const determineStars = (score: number) => {
      if (score === 1000) return ['/filled-star.png', '/filled-star.png', '/filled-star.png'];
      if (score >= 600) return ['/filled-star.png', '/filled-star.png', '/blank-star.png'];
      if (score >= 200) return ['/filled-star.png', '/blank-star.png', '/blank-star.png'];
      return ['/blank-star.png', '/blank-star.png', '/blank-star.png'];
    };

    const determineBackgroundAndAudio = (score: number) => {
      if (score < 200) {
        setBackground('/board-lose.png');
        setAudioUrl('/bg-lose.mp3');
      } else {
        setBackground('/board-win.png');
        setAudioUrl('/bg-victory.mp3');
      }
    };

    const deleteSession = async () => {
      await fetch(`/api/session?id=${sessionId}`, {
        method: 'DELETE',
      });
    };

    const fetchSession = async () => {
      const response = await fetch(`/api/session?id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setScore(data.score);
          setTime(data.time);
          setTotal(10); // Assumindo 10 perguntas

          setStars(determineStars(data.score));
          determineBackgroundAndAudio(data.score);

          if (!savedRef.current) {
            await fetch('/api/save-results', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                playerName,
                genre: playerGender,
                totalTime: data.time,
                mode: 'default',
              }),
            });
          
            savedRef.current = true;
          }

          const rankingResponse = await fetch(`/api/ranking?mode=default&playerName=${playerName}`);
          const ranking = await rankingResponse.json();
          setMyRank(ranking.playerPosition);

          await deleteSession(); // Apaga a sessão após salvar o resultado e pegar o ranking

          setLoading(false);
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    };

    fetchSession();
  }, [sessionId, router, playerName, playerGender]);

  if (loading) return <FullScreenLoader />;

  const { src: avatarSrc, bgColor: avatarBgColor } = determineAvatarDetails(playerGender);

  return (
    <>
      <Confetti />
      <div className="flex items-center justify-center h-screen">
        <div
          className={`${luckiest.className} relative w-[635px] h-[700px] px-32 py-16 text-amber-800`}
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className='flex flex-col content-between mt-20'>
            {/* Estrelas */}
            <div className="flex justify-between  mb-4 px-6">
              {stars.map((star, index) => (
                <Image key={index} src={star} alt={`Star ${index + 1}`} width={100} height={100} />
              ))}
            </div>

            {/* Info */}
            <div className="flex justify-center mb-2">
              <div className={`flex items-center justify-center rounded-full shadow-lg ${avatarBgColor} border-4 border-orange-700 w-[100px] h-[100px]`}>
                <Image src={avatarSrc} alt="Avatar" width={100} height={100} className="rounded-full" />
              </div>
            </div>
            <p className="text-center text-2xl text-orange-700">Parabéns, {playerName}!</p>
            <p className="text-center mb-4">Você completou mais uma lição.</p>
            <p className="text-center shadow shadow-orange-400 bg-orange-100 bg-opacity-50 py-2 rounded-full mb-4">Você fez <span className='text-[#7cb342] text-2xl'>{score} pts</span> &nbsp;em&nbsp; <span className='text-[#7cb342] text-2xl'>{time !== null ? (
                <>{formatTime(time)}</>
              ) : (
                <span className='text-amber-600'>Carregando tempo...</span>
              )}</span> min</p>
            <p className="text-center shadow shadow-orange-400 bg-orange-100 bg-opacity-50 py-2 rounded-full mb-4">Você ficou em <span className='text-amber-500 text-2xl'>{myRank}º lugar</span></p>

            {/* Botão Home */}
            <div className='flex justify-between mx-10'>
              <IconButton name="try-again" size={72} onClick={() => router.push('/classMode/select')} />
              <IconButton name="home" size={72} onClick={() => router.push('/')} />
              <IconButton name="ranking" size={72} onClick={() => router.push('/classMode/ranking')} />
            </div>

          </div>
        </div>        
        
        {/* {isPlaying !== null && (
          <button
            onClick={toggle}
            className="fixed bottom-8 left-8 bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center border-4 border-white text-3xl"
          >
            {isPlaying ? '🔊' : '🔇'}
          </button>
        )} */}

        {isPlaying !== null && (
          <div className="fixed bottom-8 left-8 flex items-center justify-center">
            {isPlaying ? <IconButton name="music-on" size={72} onClick={toggle} /> : <IconButton name="music-off" size={72} onClick={toggle} />}
          </div>
        )}
      </div>
    </>
  );
}
