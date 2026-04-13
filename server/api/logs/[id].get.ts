import { db } from '#server/utils/database';
import { cookingLogs } from '../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '');

  const user = event.currentUser;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });
  }

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "기록이 존재하지 않습니다." });
  }

  const log = await db.query.cookingLogs.findFirst({
    where: eq(cookingLogs.id, id),
    with: {
      recipe: true
    }
  });

  if (!log) throw createError({ statusCode: 404, statusMessage: '기록을 찾을 수 없습니다.' });

  return { data: log };
});
