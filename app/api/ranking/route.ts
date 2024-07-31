import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode');

  if (!mode) {
    return NextResponse.json({ error: 'Modo de jogo não especificado' }, { status: 400 });
  }

  try {
    const rankings = await prisma.ranking.findMany({
      where: { mode },
      orderBy: [
        { totalScore: 'desc' },
        { totalTime: 'asc' },
      ],
      take: 10, // Limita a 10 melhores pontuações
    });
    return NextResponse.json(rankings);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar rankings' }, { status: 500 });
  }
}
