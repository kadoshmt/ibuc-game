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

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        // Não especifica ssl aqui, pois Prisma não suporta essa configuração
        url: process.env.DATABASE_URL,
      },
    },
  });
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  prisma = (global as any).prisma;
}

export default prisma;
