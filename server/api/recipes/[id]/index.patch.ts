import { db } from '#server/utils/database';
import { recipes, recipeIngredients, recipeSteps } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '');
  const user = event.currentUser;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });
  }

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "레시피가 존재하지 않습니다." });
  }

  const body = await readBody(event);

  return await db.transaction(async (tx) => {
    await tx.update(recipes)
      .set({
        title: body.title,
        description: body.description,
        isPublic: body.isPublic
      })
      .where(and(eq(recipes.id, id), eq(recipes.userId, user.id)));

    await tx.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, id));
    await tx.delete(recipeSteps).where(eq(recipeSteps.recipeId, id));

    if (body.ingredients?.length) {
      await tx.insert(recipeIngredients).values(
        body.ingredients.map((ing: any) => ({
          recipeId: id,
          name: ing.name,
          amount: ing.amount
        }))
      );
    }

    if (body.steps?.length) {
      await tx.insert(recipeSteps).values(
        body.steps.map((step: any, idx: number) => ({
          recipeId: id,
          stepOrder: idx + 1,
          instruction: step.instruction,
          timerSeconds: step.timerSeconds || 0
        }))
      );
    }

    return { success: true };
  });
});
