import { pgTable, serial, integer, varchar, date, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const userFridge = pgTable('user_fridge', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  ingredientName: varchar('ingredient_name', { length: 100 }).notNull(),
  expiredAt: date('expired_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
