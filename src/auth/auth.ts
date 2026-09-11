import { betterAuth } from 'better-auth';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

export async function createAuth(mongoUri?: string) {
  const resolvedMongoUri = mongoUri || process.env.MONGODB_URI;

  const effectiveMongoUri =
    resolvedMongoUri || (await MongoMemoryServer.create()).getUri();

  const mongoClient = new MongoClient(effectiveMongoUri);
  const dbName = (() => {
    try {
      const pathname = new URL(effectiveMongoUri).pathname;
      const sanitized = pathname.replace(/^\/+|\/+$/g, '');

      return sanitized || 'web-shop';
    } catch {
      return 'web-shop';
    }
  })();

  const db = mongoClient.db(dbName);

  return betterAuth({
    database: mongodbAdapter(db, {
      client: mongoClient,
      transaction: false,
    }),
    emailAndPassword: {
      enabled: true,
    },
    secret: process.env.BETTER_AUTH_SECRET || 'change-me-super-secret-key',
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    basePath: '/api/auth',
    trustedOrigins: [
      process.env.FRONTEND_URL || 'http://localhost:4200',
      process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    ],
  });
}
