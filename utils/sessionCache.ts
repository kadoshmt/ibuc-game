import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const createSession = async (data: { levelId: number, moduleId: number, lessonId: number, score: number, time: number }) => {
  const sessionId = uuidv4();
  await prisma.session.create({
    data: {
      id: sessionId,
      levelId: data.levelId,
      moduleId: data.moduleId,
      lessonId: data.lessonId,
      score: data.score,
      time: data.time,
    },
  });
  return sessionId;
};

export const getSession = async (sessionId: string) => {
  return await prisma.session.findUnique({
    where: { id: sessionId },
  });
};

export const updateSession = async (sessionId: string, data: { score: number, time: number }) => {
  await prisma.session.update({
    where: { id: sessionId },
    data: {
      score: data.score,
      time: data.time,
    },
  });
};

export const deleteSession = async (sessionId: string) => {
  await prisma.session.delete({
    where: { id: sessionId },
  });
};
