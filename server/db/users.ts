import { pgTable, serial, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { recipes } from './recipes';
import { cookingLogs } from './cookingLogs';
import { follows } from './follows';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  nickname: varchar('nickname', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  password: varchar('password', { length: 255 }).notNull(),
  enabled: boolean('enabled').notNull().default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  recipes: many(recipes),
  cookingLogs: many(cookingLogs),
  followers: many(follows, { relationName: 'following' }),
  following: many(follows, { relationName: 'follower' }),
}));
