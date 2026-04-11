import { extractRecipeFromText } from '~/server/utils/ai';

export default defineEventHandler(async (event) => {
  const { rawText } = await readBody(event);
  const recipeData = await extractRecipeFromText(rawText);
  return { success: true, data: recipeData };
});
