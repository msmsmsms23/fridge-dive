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
  // 내가 팔로우를 '받는' 경우 (나의 팔로워들)
  followers: many(follows, { relationName: 'following_user' }),
  // 내가 팔로우를 '하는' 경우 (나의 팔로잉들)
  following: many(follows, { relationName: 'follower_user' }),
}));
