import { pgTable, serial, integer, varchar, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm'
import { recipes } from './recipes';

export const recipeIngredients = pgTable('recipe_ingredients', {
  id: serial('id').primaryKey(),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  amount: varchar('amount', { length: 50 }),
  isEssential: boolean('is_essential').default(true).notNull(),
});

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeIngredients.recipeId],
    references: [recipes.id],
  }),
}));
