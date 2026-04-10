import { db } from '../utils/database';
import { recipes, recipeIngredients, recipeSteps } from '../db/schema';
import { extractRecipeFromImage } from '../utils/ai';
import fs from 'node:fs';

export default defineEventHandler(async (event) => {
  const user = event.currentUser;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "로그인이 필요합니다.",
    });
  }

  try {
    // 1. AI로 데이터 추출 (기존 코드)
    const imagePath = './test-image.jpg';
    const imageBuffer = fs.readFileSync(imagePath);
    const recipeData = await extractRecipeFromImage(imageBuffer, 'image/jpeg');

    // 2. DB에 저장 시작 (트랜잭션)
    const savedRecipe = await db.transaction(async (tx) => {
      // (1) 메인 레시피 정보 저장
      const [newRecipe] = await tx.insert(recipes).values({
        title: recipeData.title,
        description: recipeData.description,
        userId: user.id,
        isAiGenerated: true,
      }).returning();

      if (!newRecipe) {
        throw createError({
          statusCode: 404,
          statusMessage: "레시피 정보에 오류가 있습니다.",
        });
      }

      // (2) 재료 저장
      if (recipeData.ingredients.length > 0) {
        await tx.insert(recipeIngredients).values(
          recipeData.ingredients.map((ing: any) => ({
            recipeId: newRecipe.id,
            name: ing.name,
            amount: ing.amount,
            isEssential: ing.isEssential,
          })),
        );
      }

      // (3) 조리 단계 저장
      if (recipeData.steps.length > 0) {
        await tx.insert(recipeSteps).values(
          recipeData.steps.map((step: any) => ({
            recipeId: newRecipe.id,
            stepOrder: step.stepOrder,
            instruction: step.instruction,
            timerSeconds: step.timerSeconds,
          })),
        );
      }

      return newRecipe;
    });

    return { success: true, recipeId: savedRecipe.id, message: "DB 저장 완료!" };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
});
