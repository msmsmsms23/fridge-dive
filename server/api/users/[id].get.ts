import { db } from '#server/utils/database';
import { users, recipes } from '../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = parseInt(event.context.params?.id || "");

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: "잘못된 사용자 ID입니다." });
  }

  try {
    // 유저 정보와 해당 유저의 '공개' 데이터만 조회
    const userProfile = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        nickname: true,
        createdAt: true,
      },
      with: {
        recipes: {
          where: eq(recipes.isPublic, 'public'),
          orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
        },
        cookingLogs: {
          orderBy: (cookingLogs, { desc }) => [desc(cookingLogs.createdAt)],
          with: {
            recipe: true
          }
        }
      }
    });

    if (!userProfile) {
      throw createError({ statusCode: 404, statusMessage: "사용자를 찾을 수 없습니다." });
    }

    return {
      success: true,
      data: userProfile
    };

  } catch (error: any) {
    console.error("User Profile API Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "프로필 데이터를 불러오는 중 오류가 발생했습니다."
    });
  }
});
