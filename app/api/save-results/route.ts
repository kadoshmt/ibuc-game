import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma-client';

export async function POST(req: Request) {
  const { playerName, genre, totalScore, totalTime, mode } = await req.json();
  try {
    const newRanking = await prisma.ranking.create({
      data: {
        playerName,
        genre,
        totalScore,
        totalTime,
        mode,
      },
    });
    return NextResponse.json(newRanking);
  } catch (error) {
    console.error('Erro ao salvar os resultados:', error);
    return NextResponse.json({ error: 'Erro ao salvar os resultados' }, { status: 500 });
  }
}
