import { db } from '#server/utils/database';
import { recipes, follows } from '../../db/schema';
import { eq, desc, and, or, inArray } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.currentUser;

  const { type } = getQuery(event);

  if (type !== 'all' && !user) {
    return { data: [], message: 'AUTH_REQUIRED' };
  }

  let whereCondition;

  if (type === 'mine' && user) {
    whereCondition = eq(recipes.userId, user.id);
  }
  else if (type === 'following' && user) {
    const myFollowing = await db.select({ id: follows.followingId })
      .from(follows).where(eq(follows.followerId, user.id));
    const followingIds = myFollowing.map(f => f.id);

    if (followingIds.length > 0) {
      whereCondition = and(
        inArray(recipes.userId, followingIds),
        eq(recipes.isPublic, 'public')
      );
    } else {
      return { data: [] };
    }
  }
  else {
    if (user) {
      whereCondition = or(
        eq(recipes.userId, user.id),
        eq(recipes.isPublic, 'public')
      );
    } else {
      whereCondition = eq(recipes.isPublic, 'public');
    }
  }

  const result = await db.query.recipes.findMany({
    where: whereCondition,
    orderBy: [desc(recipes.createdAt)],
    with: {
      cookingLogs: true,
      user: true
    }
  });

  return { data: result };
});
