import { db } from '#server/utils/database';
import { cookingLogs } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.currentUser;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });
  }

  const logs = await db.query.cookingLogs.findMany({
    where: eq(cookingLogs.userId, user.id),
    orderBy: [desc(cookingLogs.createdAt)],
    with: {
      recipe: true,
    },
  });

  return {
    data: logs
  };
});
