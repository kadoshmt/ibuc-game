import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get('moduleId');

  try {
    if (moduleId) {
      // Buscar lições de um módulo específico, sem incluir as perguntas
      const lessons = await prisma.lesson.findMany({
        where: { moduleId: parseInt(moduleId, 10) },
        select: {
          id: true,
          name: true,
          moduleId: true,
        },
        orderBy: {id : 'asc'}
      });
      return NextResponse.json(lessons);
    } else {
      // Buscar todas as lições, sem incluir as perguntas
      const allLessons = await prisma.lesson.findMany({
        select: {
          id: true,
          name: true,
          moduleId: true,
        },
      });
      return NextResponse.json(allLessons);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar as lições' }, { status: 500 });
  }
}
