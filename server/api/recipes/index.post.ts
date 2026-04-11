import { db } from '../../utils/database';
import { recipes, recipeIngredients, recipeSteps } from '../../db/schema';

export default defineEventHandler(async (event) => {
  const user = event.currentUser;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });
  }

  const { recipeData } = await readBody(event);

  try {
    const savedRecipe = await db.transaction(async (tx) => {
      const [newRecipe] = await tx.insert(recipes).values({
        title: recipeData.title,
        description: recipeData.description || "",
        userId: user.id,
        isAiGenerated: true,
      }).returning();

      if (!newRecipe) throw new Error("레시피 헤더 저장 실패");

      if (recipeData.ingredients?.length > 0) {
        await tx.insert(recipeIngredients).values(
          recipeData.ingredients.map((ing: any) => ({
            recipeId: newRecipe.id,
            name: ing.name,
            amount: ing.amount || "",
            isEssential: ing.isEssential ?? true,
          }))
        );
      }

      if (recipeData.steps?.length > 0) {
        await tx.insert(recipeSteps).values(
          recipeData.steps.map((step: any) => ({
            recipeId: newRecipe.id,
            stepOrder: step.stepOrder,
            instruction: step.instruction,
            timerSeconds: step.timerSeconds || 0,
          }))
        );
      }

      return newRecipe;
    });

    return { success: true, recipeId: savedRecipe.id };
  } catch (error: any) {
    console.error("DB 저장 오류:", error);
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
