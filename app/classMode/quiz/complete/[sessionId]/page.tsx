'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Confetti from '@/components/Confetti';
import FullScreenLoader from '@/components/FullScreenLoader';
import useAudio from '@/hooks/useAudio';
import Image from 'next/image';
import { Luckiest_Guy } from 'next/font/google';
import IconButton from '@/components/IconButton'; // Importe o novo componente de botão
import '@/app/styles/quizCompletePage.css'; // Importa o arquivo CSS
import RotatePhone from '@/components/RotatePhone';

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
                totalScore: data.score,
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
      <RotatePhone />
      <Confetti />
      <div className="quiz-complete-container">
        <div
          className={`quiz-complete-content ${luckiest.className}`}
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="quiz-complete-box">
          <div className="quiz-complete-box-content">
            {/* Estrelas */}
            <div className="quiz-complete-stars">
              {stars.map((star, index) => (
                <Image key={index} src={star} alt={`Star ${index + 1}`} width={100} height={100} />
              ))}
            </div>

            {/* Info */}
            <div className="quiz-complete-avatar-container">
              <div className={`quiz-complete-avatar ${avatarBgColor}`}>
                <Image src={avatarSrc} alt="Avatar" width={100} height={100} className="rounded-full" />
              </div>
            </div>
            <p className="quiz-complete-message">Parabéns, {playerName}!</p>
            <p className="quiz-complete-message-2nd-line">Você completou mais uma lição.</p>
            <p className="quiz-complete-summary">Você fez <span className='text-[#7cb342] text-2xl'>{score} pts</span> &nbsp;em&nbsp; <span className='text-[#7cb342] text-2xl'>{time !== null ? (
                <>{formatTime(time)}</>
              ) : (
                <span className='text-amber-600'>Carregando tempo...</span>
              )}</span> min</p>
            <p className="quiz-complete-rank">Você ficou em <span className='text-amber-500 text-2xl'>{myRank}º lugar</span></p>

            {/* Botões */}
            <div className="quiz-complete-buttons">
              <IconButton name="try-again" size={72} onClick={() => router.push('/classMode/select')} />
              <IconButton name="home" size={72} onClick={() => router.push('/')} />
              <IconButton name="ranking" size={72} onClick={() => router.push('/classMode/ranking')} />
            </div>

          </div>
          </div>
        </div>          
        
        {isPlaying !== null && (
                <IconButton name={`${isPlaying ? "music-on": "music-off"}`} size={72} onClick={toggle} float='left' />
        )}
      </div>
    </>
  );
}