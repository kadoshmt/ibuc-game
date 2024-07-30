import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { playerName, totalScore, totalTime, mode } = await req.json();
  try {
    const newRanking = await prisma.ranking.create({
      data: {
        playerName,
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
