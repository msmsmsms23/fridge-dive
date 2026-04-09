import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, client } from './server/utils/database';

await migrate(db, { migrationsFolder: './migrations' });
await client.end();
