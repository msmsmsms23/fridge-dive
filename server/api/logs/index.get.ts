import { db } from '#server/utils/database';
import { cookingLogs, follows } from '../../db/schema';
import { eq, desc, inArray } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.currentUser;

  const { type } = getQuery(event);

  if ((type === 'mine' || type === 'following') && !user) {
    return { data: [], message: 'AUTH_REQUIRED' };
  }

  let whereCondition;

  if (type === 'mine' && user) {
    whereCondition = eq(cookingLogs.userId, user.id);
  }

  else if (type === 'following' && user) {
    const myFollowing = await db.select({ id: follows.followingId })
      .from(follows).where(eq(follows.followerId, user.id));
    const followingIds = myFollowing.map(f => f.id);

    if (followingIds.length > 0) {
      whereCondition = inArray(cookingLogs.userId, followingIds);
    } else {
      return { data: [] };
    }
  }

  else {
    whereCondition = undefined;
  }

  const logs = await db.query.cookingLogs.findMany({
    where: whereCondition,
    orderBy: [desc(cookingLogs.createdAt)],
    with: {
      recipe: true,
      user: true,
    },
  });

  const filteredLogs = logs.filter(log => {
    if (user && log.userId === user.id) return true;
    return log.recipe?.isPublic === 'public';
  });

  return { data: filteredLogs };
});
