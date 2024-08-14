'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { shuffle } from '@/utils/shuffle';
import { Question } from '@/types';
import { Patrick_Hand, Rammetto_One, Spline_Sans_Mono } from 'next/font/google';
import Image from 'next/image';
import { playCorrectSound, playIncorrectSound } from '@/utils/soundEffects';
import FullScreenLoader from '@/components/FullScreenLoader';
import useAudio from '@/hooks/useAudio';
import IconButton from '@/components/IconButton';

const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400" });
const patrick = Patrick_Hand({ subsets: ["latin"], weight: "400" });
const fontNumbers = Spline_Sans_Mono({ subsets: ["latin"], weight: "700" });

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [playerGender, setPlayerGender] = useState<string>('');
  const router = useRouter();
  const { sessionId } = useParams();

  const { isPlaying, toggle } = useAudio('/bg-quiz-classmode.mp3', true, true, !loading);

  const answerLabels = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    const fetchSession = async () => {
      if (sessionId) {
        try {
          const response = await fetch(`/api/session?id=${sessionId}`);
          if (response.ok) {
            const session = await response.json();
            const { levelId, moduleId, lessonId } = session;
            if (levelId && moduleId && lessonId) {
              const res = await fetch(`/api/questions?levelId=${levelId}&moduleId=${moduleId}&lessonId=${lessonId}`);
              if (!res.ok) {
                throw new Error('Network response was not ok');
              }
              const data: Question[] = await res.json();
              const shuffledQuestions = shuffle(data).map((question: Question) => ({
                ...question,
                answers: shuffle(question.answers),
              }));
              setQuestions(shuffledQuestions);
              setLoading(false); // Desativa o carregamento quando os dados estiverem prontos
              setStartTime(Date.now()); // Define o tempo de início quando as perguntas são carregadas
              setElapsedTime(0);
            } else {
              router.push('/');
            }
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error('Error fetching session or questions:', error);
          router.push('/');
        }
      } else {
        router.push('/');
      }
    };

    fetchSession();
  }, [sessionId, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        setElapsedTime(Date.now() - startTime);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    if (!loading && startTime === 0) {
      setStartTime(Date.now());
    }
  }, [loading, startTime]);

  useEffect(() => {
    const name = localStorage.getItem('playerName') || '';
    const gender = localStorage.getItem('playerGender') || 'menino'; // Default to 'menino' if not set
    setPlayerName(name);
    setPlayerGender(gender);
  }, []);

  const formatTime = (time: number | null) => {
    if (time === null) {
      return '00:00';
    }
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getAvatarDetails = () => {
    switch (playerGender) {
      case 'menino':
        return { src: '/avatar-boy.png', bgColor: 'bg-blue-500' };
      case 'menina':
        return { src: '/avatar-girl.png', bgColor: 'bg-pink-500' };
      case 'equipe':
      default:
        return { src: '/avatar-team.png', bgColor: 'bg-yellow-500' };
    }
  };

  const handleNextQuestion = async () => {
    if (questionIndex + 1 >= questions.length) {
      const endTime = Date.now();
      const totalTime = (endTime - startTime) / 1000; // Calcula o tempo total em segundos
      await fetch(`/api/session?id=${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, time: totalTime }),
      });
      router.push(`/classMode/quiz/complete/${sessionId}`);
    } else {
      setSelectedAnswer(null);
      setShowFeedback(false);
      setExplanation('');
      setFlashIndex(null);
      setQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const deleteSession = async () => {
    if (sessionId) {
      try {
        await fetch(`/api/session?id=${sessionId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const handleSelect = async () => {
    await deleteSession();
    router.push('/classMode/select');
  };
  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    const answer = questions[questionIndex].answers[index];
    const correct = answer.isCorrect;

    if (correct) {
      playCorrectSound();
      setScore(score + 100); // Cada resposta correta adiciona 100 pontos
      setFlashIndex(index);
    } else {
      playIncorrectSound();
      setExplanation(answer.explanation || '');
    }

    setShowFeedback(true);

    setTimeout(() => {
      setFlashIndex(null);
    }, 1500);
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  if (questions.length === 0) {
    return <div className="flex items-center justify-center h-screen bg-gray-100">Nenhuma pergunta encontrada para esta seleção.</div>;
  }

  const currentQuestion = questions[questionIndex];
  const { src: avatarSrc, bgColor: avatarBgColor } = getAvatarDetails();

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/quiz-classmode.webp)' }}>
      <div className="relative w-[1000px] h-[849px] flex flex-col justify-between" style={{ backgroundImage: 'url(/pergaminho.png)', backgroundSize: 'cover' }}>
        <div className="text-center  w-full flex justify-center px-56 pt-14">
          <div className={`flex items-center gap-2`}>
            <div className={`rounded-full shadow-lg ${avatarBgColor} border-8 border-orange-700`}>
              <Image src={avatarSrc} alt="Avatar" width={88} height={88} className="rounded-full" />
            </div>
            <span className={`${rammetto.className} bg-orange-700 text-white text-2xl p-2 px-6 rounded-full`}>{playerName}</span>
          </div>
        </div>
        <div className={`${patrick.className} text-center mx-60  h-[460px] flex flex-col justify-between`}>
          <div>
            <p className="text-3xl text-amber-700 font-bold">{currentQuestion.question}</p>
            <ul className="mt-4 text-2xl text-amber-700">
              {currentQuestion.answers.map((option, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full px-14 p-2 rounded-lg font-semibold text-left mb-2 ${!showFeedback ? 'hover:bg-amber-600 hover:text-amber-600 hover:bg-opacity-15' : ''} ${
                      selectedAnswer === index
                        ? option.isCorrect
                          ? 'bg-green-800 text-green-800 bg-opacity-25'
                          : 'bg-red-600 text-red-800 bg-opacity-25'
                        : ''
                    } ${flashIndex === index ? 'flash' : ''}`}
                    disabled={showFeedback}
                  >
                    <span className="text-center bg-amber-300 bg-opacity-25 rounded  px-1 mr-1">{answerLabels[index]}</span> {option.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {showFeedback && !questions[questionIndex].answers[selectedAnswer!].isCorrect && (
            <div className="text-lg text-center text-red-600 bg-amber-500 bg-opacity-10 rounded-lg p-1 mb-4 w-full">
              <p>{explanation}</p>
            </div>
          )}
          {showFeedback && (
            <div className="text-center">
              <button
                onClick={handleNextQuestion}
                className={`${rammetto.className} bg-[#bf360c] border-2 border-orange-800 text-white text-sm py-4 px-4 rounded-lg w-fit`}
              >
                {questionIndex + 1 >= questions.length ? 'Finalizar Quiz' : 'Próxima Pergunta'}
              </button>
            </div>
          )}

          {isPlaying !== null && (
          <div className="fixed bottom-8 left-8 flex items-center justify-center">
            {isPlaying ? <IconButton name="music-on" size={72} onClick={toggle} /> : <IconButton name="music-off" size={72} onClick={toggle} />}
          </div>
        )}

        <div className="fixed bottom-8 right-8 flex items-center justify-center">
          <IconButton name="try-again" size={72} onClick={handleSelect} />
        </div>

        </div>
        <div className="flex justify-between w-full px-56 pb-10">
          <div className={`${fontNumbers.className} text-3xl text-white font-bold bg-orange-600 px-2 py-2 rounded-3xl min-w-36 flex items-center gap-3`}>
             <span className=""><Image src="/coin-star.png" alt="Pontos" width={36} height={36} /></span><span>{score}</span>
          </div>
          <div className="flex items-center justify-between text-xl text-amber-700 font-bold bg-orange-600 px-2 py-2 rounded-3xl min-w-36 mr-2 gap-1">
            <Image src="/clock.png" alt="Tempo" width={36} height={36} />            
            <span className={`${fontNumbers.className} text-3xl font-bold text-white min-w-30 mr-1`}>{formatTime(elapsedTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
