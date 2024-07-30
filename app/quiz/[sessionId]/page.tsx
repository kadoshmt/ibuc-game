'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Question } from '@/types';
import { shuffle } from '@/utils/shuffle';

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const router = useRouter();
  const { sessionId } = useParams();

  useEffect(() => {
    const fetchSession = async () => {
      if (sessionId) {
        const response = await fetch(`/api/session?id=${sessionId}`);
        if (response.ok) {
          const session = await response.json();
          const { levelId, moduleId, lessonId } = session;
          if (levelId && moduleId && lessonId) {
            fetch(`/api/questions?levelId=${levelId}&moduleId=${moduleId}&lessonId=${lessonId}`)
              .then((res) => {
                if (!res.ok) {
                  throw new Error('Network response was not ok');
                }
                return res.json();
              })
              .then((data: Question[]) => {
                const shuffledQuestions = shuffle(data).map((question: Question) => ({
                  ...question,
                  answers: shuffle(question.answers),
                }));
                setQuestions(shuffledQuestions);
                setLoading(false);
                setStartTime(Date.now()); // Set start time when questions are loaded
              })
              .catch((error) => {
                console.error('Error fetching questions:', error);
                setLoading(false);
              });
          } else {
            router.push('/');
          }
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    };

    fetchSession();
  }, [sessionId, router]);

  const handleNextQuestion = async () => {
    if (questionIndex + 1 >= questions.length) {
      const endTime = Date.now();
      const totalTime = (endTime - startTime) / 1000; // Calculate total time in seconds
      await fetch(`/api/session?id=${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, time: totalTime }),
      });
      router.push(`/quiz/complete/${sessionId}`);
    } else {
      setSelectedAnswer(null);
      setShowFeedback(false);
      setExplanation('');
      setQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    const answer = questions[questionIndex].answers[index];
    const correct = answer.isCorrect;
    if (correct) {
      setScore(score + 100); // Each correct answer adds 100 points
    } else {
      setExplanation(answer.explanation || '');
    }
    setShowFeedback(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100">Carregando perguntas...</div>;
  }

  if (questions.length === 0) {
    return <div className="flex items-center justify-center h-screen bg-gray-100">Nenhuma pergunta encontrada para esta seleção.</div>;
  }

  const currentQuestion = questions[questionIndex];

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative w-[800px] h-[600px] bg-white shadow-lg rounded-lg p-8 overflow-hidden">
        <h1 className="text-3xl font-bold mb-4">Quiz</h1>
        <div className="mb-4 text-center">
          <p className="text-xl font-bold mb-6">{currentQuestion.question}</p>
          <ul>
            {currentQuestion.answers.map((option, index) => (
              <li key={index}>
                <button
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-2 border rounded mb-2 ${
                    selectedAnswer === index
                      ? option.isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : ''
                  }`}
                  disabled={showFeedback}
                >
                  {option.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {showFeedback && !questions[questionIndex].answers[selectedAnswer!].isCorrect && (
          <div className="text-center text-yellow-900 font-bold bg-yellow-50 border border-yellow-900 rounded p-4 mb-4 mx-auto">
            <p>{explanation}</p>
          </div>
        )}
        {showFeedback && (
          <button
            onClick={handleNextQuestion}
            className="bg-blue-500 text-white py-2 px-4 rounded absolute bottom-4 left-1/2 transform -translate-x-1/2"
          >
            {questionIndex + 1 >= questions.length ? 'Finalizar Quiz' : 'Próxima Pergunta'}
          </button>
        )}
      </div>
    </div>
  );
}
