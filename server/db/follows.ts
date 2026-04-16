import { pgTable, serial, timestamp, integer, unique } from 'drizzle-orm/pg-core';
import { users } from './users';

export const follows = pgTable('follows', {
  id: serial('id').primaryKey(),
  followerId: integer('follower_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  followingId: integer('following_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => ({
  unq: unique().on(t.followerId, t.followingId),
}));
