import { db } from '#server/utils/database';

export default defineEventHandler(async (event) => {
  const user = event.currentUser;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });
  }

  try {
    const communityRecipes = await db.query.recipes.findMany({
      where: (recipes, { eq }) => eq(recipes.isPublic, 'public'),
      with: {
        user: {
          columns: {
            id: true,
            nickname: true
          }
        },
        reactions: true
      },
      orderBy: (recipes, { desc }) => [desc(recipes.createdAt)]
    });

    return communityRecipes;
  } catch (error: any) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: "데이터 로드 실패" });
  }
});
