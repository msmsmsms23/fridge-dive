import { pgTable, serial, timestamp, integer, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { cookingLogs } from './cookingLogs';

export const reactions = pgTable('reactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  logId: integer('log_id').references(() => cookingLogs.id, { onDelete: 'cascade' }).notNull(),
  emoji: varchar('emoji', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const reactionsRelations = relations(reactions, ({ one }) => ({
  recipe: one(cookingLogs, {
    fields: [reactions.logId],
    references: [cookingLogs.id],
  }),
  user: one(users, {
    fields: [reactions.userId],
    references: [users.id],
  }),
}));
