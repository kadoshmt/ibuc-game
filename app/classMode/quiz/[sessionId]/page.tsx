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
import '@/app/styles/quizPage.css';
import RotatePhone from '@/components/RotatePhone';

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
    const name = localStorage.getItem('playerName') || 'Visitante'; // Default  'Visitante' se não selecionado
    const gender = localStorage.getItem('playerGender') || 'menino'; // Default  'menino' se não selecionado
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
    <>
      <RotatePhone />
      <div className="quiz-container">
        <div className="quiz-content">          
          <div className='quiz-scroll-background'>
            <div className='quiz-inner'>

              <div className="quiz-avatar-name">
                <div className={`flex items-center gap-2`}>
                  <div className={`rounded-full shadow-lg ${avatarBgColor} border-8 border-orange-700`}>
                    <Image src={avatarSrc} alt="Avatar" width={88} height={88} className="rounded-full" />
                  </div>
                  <span className={`quiz-player-name ${rammetto.className}`}>{playerName}</span>
                </div>
              </div>
              <div className={`quiz-question-container ${patrick.className}`}>
                <div>
                  <p className="quiz-question">{currentQuestion.question}</p>
                  <ul className="quiz-answer-list">
                    {currentQuestion.answers.map((option, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleAnswerSelect(index)}
                          className={`quiz-answer ${!showFeedback ? 'hover:bg-amber-600 hover:text-amber-600 hover:bg-opacity-15' : ''} ${
                            selectedAnswer === index
                              ? option.isCorrect
                                ? 'correct'
                                : 'incorrect'
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
                  <div className="quiz-explanation">
                    <p>{explanation}</p>
                  </div>
                )}
                {showFeedback && (
                  <div className="text-center">
                    <button
                      onClick={handleNextQuestion}
                      className={`quiz-next-button ${rammetto.className}`}
                    >
                      {questionIndex + 1 >= questions.length ? 'Finalizar Quiz' : 'Próxima Pergunta'}
                    </button>
                  </div>
                )}

              </div>
              <div className="quiz-score-time-container">
                <div className={`quiz-score ${fontNumbers.className}`}>
                  <span className=""><Image src="/coin-star.png" alt="Pontos" width={36} height={36} /></span><span>{score}</span>
                </div>
                <div className="quiz-time">
                  <Image src="/clock.png" alt="Tempo" width={36} height={36} />            
                  <span className={`${fontNumbers.className} text-3xl font-bold min-w-30 mr-1`}>{formatTime(elapsedTime)}</span>
                </div>
              </div>   
            </div>
            
          </div>          

            
        </div>
        
        <div className='quiz-sidebar-container'>
          <div className='quiz-sidebar-content'>
          <div className="quiz-sidebar-card">
            <div className="quiz-sidebar-avatar-name">                
                <div className={`flex rounded-full shadow-lg ${avatarBgColor} border-4 border-orange-700`}>
                  <Image src={avatarSrc} alt="Avatar" width={70} height={70} className="rounded-full" />
                </div>
                <div className={`quiz-sidebar-player-name ${rammetto.className}`}>{playerName}</div>
            </div>

            <div className="quiz-sidebar-score-time-container">
                <div className={`quiz-sidebar-score ${fontNumbers.className}`}>
                  <div className=""><Image src="/coin-star.png" alt="Pontos" width={24} height={24} /></div><div>{score}</div>
                </div>
                <div className="quiz-sidebar-time">
                  <Image src="/clock.png" alt="Tempo" width={24} height={24} />            
                  <div className={`${fontNumbers.className} font-bold min-w-30`}>{formatTime(elapsedTime)}</div>
                </div>
            </div>  
            <span className="top"></span>
            <span className="right"></span>
            <span className="bottom"></span>
            <span className="left"></span>
          </div>
          </div>
        </div>
      </div>
      {isPlaying !== null && (
                <IconButton name={`${isPlaying ? "music-on": "music-off"}`} size={72} onClick={toggle} float='left' />
        )}

        <IconButton name="try-again" size={72} onClick={handleSelect} float='right' />
    </>
  );
}
