import { pgTable, serial, timestamp, varchar, boolean, integer, text } from 'drizzle-orm/pg-core';
import { users } from './users';

export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  thumbnailImageUrl: text('thumbnail_image_url'),
  isAiGenerated: boolean('is_ai_generated').default(false).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
