import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode');
  const playerName = searchParams.get('playerName');

  if (!mode) {
    return NextResponse.json({ error: 'Modo de jogo não especificado' }, { status: 400 });
  }

  try {
    // Busca o ranking completo, ordenado por totalScore e totalTime
    const allRankings = await prisma.ranking.findMany({
      where: { mode },
      orderBy: [
        { totalScore: 'desc' },
        { totalTime: 'asc' },
      ],
    });

    // Calcula a posição do jogador, se o playerName for fornecido
    let playerPosition = null;
    if (playerName) {
      playerPosition = allRankings.findIndex(rank => rank.playerName === playerName) + 1;
    }

    // Limita a resposta a 15 melhores pontuações
    const topRankings = allRankings.slice(0, 15);

    return NextResponse.json({ rankings: topRankings, playerPosition });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar rankings' }, { status: 500 });
  }
}
