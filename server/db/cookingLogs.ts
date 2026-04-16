import {pgTable, serial, integer, text, timestamp, varchar} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm'
import { users } from './users';
import { recipes } from './recipes';

export const cookingLogs = pgTable('cooking_logs', {
  id: serial('id').primaryKey(),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  finishedImageUrl: text('finished_image_url'),
  memo: text('memo'),
  isPublic: varchar('is_public', { length: 20 }).default('private').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const cookingLogsRelations = relations(cookingLogs, ({ one }) => ({
  recipe: one(recipes, {
    fields: [cookingLogs.recipeId],
    references: [recipes.id],
  }),
  user: one(users, {
    fields: [cookingLogs.userId],
    references: [users.id],
  }),
}));
