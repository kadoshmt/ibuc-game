import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const levelId = parseInt(searchParams.get('levelId') || '0', 10);
  const moduleId = parseInt(searchParams.get('moduleId') || '0', 10);
  const lessonId = parseInt(searchParams.get('lessonId') || '0', 10);

  if (!levelId || !moduleId || !lessonId) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

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

  return NextResponse.json(questions);
}
