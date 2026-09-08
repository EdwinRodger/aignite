import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

// Singleton client configuration for Next.js hot-reloading
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const client =
  globalForDb.conn ??
  (connectionString
    ? postgres(connectionString, { prepare: false })
    : (null as unknown as postgres.Sql));

if (process.env.NODE_ENV !== 'production' && client) {
  globalForDb.conn = client;
}

export const db = client ? drizzle(client, { schema }) : null;
