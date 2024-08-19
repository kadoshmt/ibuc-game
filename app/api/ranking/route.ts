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
    // Define o fator de penalidade para o tempo (ajuste conforme necessário)
    const penaltyFactor = 2;

    // Busca o ranking completo, ordenado por totalScore e totalTime
    const allRankings = await prisma.ranking.findMany({
      where: { mode },
      orderBy: [
        { totalScore: 'desc' },
        { totalTime: 'asc' },
      ],
    });

    // Calcula a pontuação final (média) para cada jogador
    const rankingsWithMedia = allRankings.map((rank) => {
      const media = rank.totalScore - (rank.totalTime / penaltyFactor);
      return { ...rank, media };
    });

    // Ordena os rankings pela nova pontuação média
    rankingsWithMedia.sort((a, b) => b.media - a.media);

    // Calcula a posição do jogador, se o playerName for fornecido
    let playerPosition = null;
    if (playerName) {
      playerPosition = rankingsWithMedia.findIndex(rank => rank.playerName === playerName) + 1;
    }

    // Limita a resposta a 15 melhores pontuações
    const topRankings = rankingsWithMedia.slice(0, 15);

    return NextResponse.json({ rankings: topRankings, playerPosition });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar rankings' }, { status: 500 });
  }
}
