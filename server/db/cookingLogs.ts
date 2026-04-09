import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { recipes } from './recipes';

export const cookingLogs = pgTable('cooking_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'set null' }),
  finishedImageUrl: text('finished_image_url'),
  memo: text('memo'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
