import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma-client';
import { Question } from '@prisma/client';  // Importar o tipo Question do Prisma

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const levelId = parseInt(searchParams.get('levelId') || '0', 10);
  const moduleId = parseInt(searchParams.get('moduleId') || '0', 10);
  const lessonId = parseInt(searchParams.get('lessonId') || '0', 10);

  if (!levelId || !moduleId || !lessonId) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

  try {
    // Especificando o tipo de retorno esperado como 'Question[]'
    const questions: Question[] = await prisma.$queryRaw<Question[]>`
      SELECT * FROM "Question"
      WHERE "levelId" = ${levelId}
      AND "moduleId" = ${moduleId}
      AND "lessonId" = ${lessonId}
      ORDER BY RANDOM()
      LIMIT 10
    `;

    if (questions.length === 0) {
      return NextResponse.json({ error: 'No questions found' }, { status: 404 });
    }

    // Buscar respostas separadamente para cada pergunta
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await prisma.answer.findMany({
          where: { questionId: question.id }
        });
        return { ...question, answers };
      })
    );

    return NextResponse.json(questionsWithAnswers);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
