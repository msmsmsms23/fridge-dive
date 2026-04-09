import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';
import { recipes } from './recipes';

export const recipeSteps = pgTable('recipe_steps', {
  id: serial('id').primaryKey(),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
  stepOrder: integer('step_order').notNull(),
  instruction: text('instruction').notNull(),
  timerSeconds: integer('timer_seconds').default(0).notNull(),
  imageUrl: text('image_url'),
});
