import { db } from '#server/utils/database';
import { reactions, cookingLogs } from '#server/db/schema';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.currentUser;

  if (!user) throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });

  const body = await readBody(event);
  const logId = parseInt(getRouterParam(event, 'id') || "");
  const { emoji } = body;

  if (!logId || !emoji) {
    throw createError({ statusCode: 400, statusMessage: "데이터가 누락되었습니다." });
  }

  const log = await db.query.cookingLogs.findFirst({
    where: eq(cookingLogs.id, logId),
  });

  if (log?.userId === user.id) {
    throw createError({ statusCode: 403, statusMessage: "자신의 기록에는 리액션할 수 없습니다." });
  }

  try {
    const existingReaction = await db.query.reactions.findFirst({
      where: and(
        eq(reactions.userId, user.id),
        eq(reactions.logId, logId),
        eq(reactions.emoji, emoji)
      )
    });

    if (existingReaction) {
      await db.delete(reactions).where(eq(reactions.id, existingReaction.id));
      return { success: true, action: 'removed' };
    } else {
      await db.insert(reactions).values({
        userId: user.id,
        logId: logId,
        emoji: emoji
      });
      return { success: true, action: 'added' };
    }

  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: "서버 오류가 발생했습니다." });
  }
});
