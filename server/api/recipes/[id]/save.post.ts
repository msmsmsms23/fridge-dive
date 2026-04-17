import { db } from '#server/utils/database';
import { bookmarks, recipes } from '#server/db/schema';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.currentUser;
  if (!user) throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });

  const { recipeId } = await readBody(event);
  if (!recipeId) throw createError({ statusCode: 400, statusMessage: "레시피 ID가 필요합니다." });

  const recipeExists = await db.query.recipes.findFirst({ where: eq(recipes.id, recipeId) });
  if (!recipeExists) throw createError({ statusCode: 404, statusMessage: "존재하지 않는 레시피입니다." });

  const existing = await db.query.bookmarks.findFirst({
    where: and(
      eq(bookmarks.userId, user.id),
      eq(bookmarks.recipeId, recipeId)
    )
  });

  if (existing) {
    await db.delete(bookmarks).where(eq(bookmarks.id, existing.id));
    return { saved: false, message: '북마크가 취소되었습니다.' };
  }

  try {
    await db.insert(bookmarks).values({
      userId: user.id,
      recipeId: recipeId
    });
    return { saved: true, message: '북마크에 저장되었습니다.' };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: "북마크 저장 중 오류가 발생했습니다." });
  }
});
