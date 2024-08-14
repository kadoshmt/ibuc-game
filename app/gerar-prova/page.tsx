"use client"
import LevelSelector from '@/components/LevelSelector';
import ModuleSelector from '@/components/ModuleSelector';
import LessonSelector from '@/components/LessonSelector';
import { useState } from 'react';

export default function GenerateTest() {

  const [level, setLevel] = useState<number | null>(null);
  const [module, setModule] = useState<number | null>(null);
  const [lesson, setLesson] = useState<number | null>(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerador de Provas</h1>
      <div className="mb-4">
        <LevelSelector onChange={setLevel} />
      </div>
      <div className="mb-4">
        <ModuleSelector onChange={setModule} />
      </div>
      <div className="mb-4">
      <LessonSelector onChange={setLesson} lessons={[{ id: 1, name: ""}]} />
      </div>
    </div>
  );
}
