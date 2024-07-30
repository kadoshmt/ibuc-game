export interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Question {
  id: number;
  question: string;
  type: string;
  tips?: string;
  imageUrl?: string;
  levelId: number;
  moduleId: number;
  lessonId: number;
  answers: Answer[];
}
