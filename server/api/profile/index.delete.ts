import { db } from '#server/utils/database';
import { users } from '../../db/schema';
import {and, eq} from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const user = event.currentUser;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });
  }

  try {
    await db.delete(users)
      .where(and(eq(users.id, user.id), eq(users.id, body.id)));
    return { success: true };
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: "탈퇴 실패" });
  }
});
