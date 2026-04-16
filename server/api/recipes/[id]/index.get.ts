import { db } from '#server/utils/database';
import { recipes } from '../../../db/schema';
import {eq, and, asc} from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  const user = event.currentUser;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });
  }

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "레시피가 존재하지 않습니다." });
  }

  try {
    const recipe = await db.query.recipes.findFirst({
      where: and(
        eq(recipes.id, parseInt(id)),
      ),
      with: {
        ingredients: true,
        steps: {
          orderBy: (steps: { stepOrder: any; }) => [asc(steps.stepOrder)],
        },
        cookingLogs: true
      },
    });

    if (!recipe) {
      throw createError({ statusCode: 404, statusMessage: "레시피를 찾을 수 없습니다." });
    }

    return { success: true, data: recipe };
  } catch (error: any) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: "데이터 로드 실패" });
  }
});
