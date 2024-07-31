import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const levelId = parseInt(searchParams.get('levelId') || '0', 10);
  const moduleId = parseInt(searchParams.get('moduleId') || '0', 10);
  const lessonId = parseInt(searchParams.get('lessonId') || '0', 10);

  console.log('chamou QUESTIONS route')

  if (!levelId || !moduleId || !lessonId) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

  try {
    const questions = await prisma.question.findMany({
      where: {
        levelId,
        moduleId,
        lessonId,
      },
      include: {
        answers: true,
      },
      take: 10,
    });

    if (questions.length === 0) {
      return NextResponse.json({ error: 'No questions found' }, { status: 404 });
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
