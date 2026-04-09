import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';

const databaseUrl = process.env.DATABASE_URL;
const databasePort = process.env.DATABASE_PORT;
const databaseUser = process.env.DATABASE_USER;
const databasePassword = process.env.DATABASE_PASSWORD;
const databaseName = process.env.DATABASE_NAME;

const client = postgres(
  `postgres://${databaseUser}:${databasePassword}@${databaseUrl}:${databasePort}/${databaseName}`,
);
const db = drizzle(client, { schema });

export { db, client };
