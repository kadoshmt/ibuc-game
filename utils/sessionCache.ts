import NodeCache from 'node-cache';
import { v4 as uuidv4 } from 'uuid';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutos de TTL

export const createSession = (data: object) => {
  const sessionId = uuidv4();
  cache.set(sessionId, data);
  return sessionId;
};

export const getSession = (sessionId: string) => {
  return cache.get(sessionId);
};

export const updateSession = (sessionId: string, data: object) => {
  cache.set(sessionId, data);
};

export const deleteSession = (sessionId: string) => {
  cache.del(sessionId);
};
