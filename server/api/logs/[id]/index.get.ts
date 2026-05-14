import { db } from '#server/utils/database';
import { cookingLogs } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "기록이 존재하지 않습니다." });
  }

  const log = await db.query.cookingLogs.findFirst({
    where: eq(cookingLogs.id, id),
    with: {
      recipe: true,
      user: {
        columns: {
          id: true,
          nickname: true
        }
      },
      reactions: true
    }
  });

  if (!log) throw createError({ statusCode: 404, statusMessage: '기록을 찾을 수 없습니다.' });

  return { data: log };
});
