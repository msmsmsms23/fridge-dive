import { pgTable, serial, timestamp, varchar, integer, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { recipeIngredients } from './recipeIngredients';
import { recipeSteps } from './recipeSteps';
import { cookingLogs } from './cookingLogs';
import { reactions } from './reactions';

export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  thumbnailImageUrl: text('thumbnail_image_url'),
  isPublic: varchar('is_public', { length: 20 }).default('private').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  user: one(users, {
    fields: [recipes.userId],
    references: [users.id],
  }),
  ingredients: many(recipeIngredients),
  steps: many(recipeSteps),
  cookingLogs: many(cookingLogs),
  reactions: many(reactions),
}));
