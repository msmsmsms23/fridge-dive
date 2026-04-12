import { db } from '#server/utils/database';
import { cookingLogs } from '../../../db/schema';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  const user = event.currentUser; // 미들웨어 설정에 따라 확인

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });
  }

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "레시피 ID가 필요합니다." });
  }

  const body = await readBody(event);
  const { memo, finishedImageUrl } = body;

  try {
    const recipeId = parseInt(id);

    const [newLog] = await db.insert(cookingLogs).values({
      recipeId: recipeId,
      userId: user.id,
      finishedImageUrl: finishedImageUrl || null,
      memo: memo || '',
    }).returning();

    return {
      success: true,
      message: "오늘의 요리 기록이 소중하게 저장되었습니다! ✨",
      data: newLog
    };
  } catch (error: any) {
    console.error('Cooking Log Error:', error);
    throw createError({ statusCode: 500, statusMessage: "기록 저장 중 오류가 발생했습니다." });
  }
});
