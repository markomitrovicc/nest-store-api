import { betterAuth } from 'better-auth';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { customSession } from 'better-auth/plugins';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { isAdminUser } from './admin';

export async function createAuth(mongoUri?: string) {
  const resolvedMongoUri = mongoUri || process.env.MONGODB_URI;

  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error(
      'BETTER_AUTH_SECRET is required. Set it in your .env file before starting the app.',
    );
  }

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
    secret,
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    basePath: '/api/auth',
    trustedOrigins: [
      process.env.FRONTEND_URL || 'http://localhost:4200',
      process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    ],

    advanced: {
      defaultCookieAttributes: {
        sameSite: 'none',
        secure: true,
      },
    },
    hooks: {
      after: createAuthMiddleware(async (ctx) => {
        const returned = ctx.context.returned;

        if (
          !returned ||
          returned instanceof APIError ||
          returned instanceof Response ||
          typeof returned !== 'object' ||
          !('user' in returned) ||
          !returned.user ||
          typeof returned.user !== 'object'
        ) {
          return;
        }

        const user = returned.user as { id?: string; email?: string };

        return ctx.json({
          ...returned,
          user: {
            ...user,
            isAdmin: isAdminUser(user),
          },
        });
      }),
    },
    plugins: [
      customSession(async ({ user, session }) => ({
        user: {
          ...user,
          isAdmin: isAdminUser(user),
        },
        session,
      })),
    ],
  });
}
