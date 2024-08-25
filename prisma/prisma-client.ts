import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const caPath = path.join(process.cwd(), 'certs', 'ca_certificate.crt');
const caCert = fs.readFileSync(caPath, 'utf8');

// Configurar o cliente PostgreSQL manualmente
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: caCert,
  },
});

client.connect();

// Função para instanciar o Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

// Declaração global para armazenar a instância do Prisma Client
declare const globalThis: {
  prismaGlobal: PrismaClient;
} & typeof global;

// Cria uma nova instância do Prisma Client ou reutiliza a existente
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Armazena a instância no globalThis apenas em ambiente de desenvolvimento
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export default prisma;
