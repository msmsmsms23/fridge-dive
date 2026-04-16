import { db } from '#server/utils/database';
import { cookingLogs } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '');

  const user = event.currentUser;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });
  }

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "요리 기록이 존재하지 않습니다." });
  }

  try {
    await db.delete(cookingLogs)
      .where(and(eq(cookingLogs.id, parseInt(id)), eq(cookingLogs.userId, user.id)));
    return { success: true };
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: "삭제 실패" });
  }
});
