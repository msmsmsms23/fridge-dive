import { db } from '../../utils/database';
import { recipes } from '../../db/schema';
import {eq, desc, asc} from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.currentUser;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });
  }

  try {
    const myRecipes = await db.query.recipes.findMany({
      where: eq(recipes.userId, user.id),
      orderBy: [desc(recipes.createdAt)],
      with: {
        cookingLogs: true,
      },
    });

    return {
      success: true,
      data: myRecipes
    };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
