import { extractRecipeFromImage } from '~/server/utils/ai';

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  const imageFile = formData?.find(item => item.name === 'image');

  if (!imageFile) throw createError({ statusCode: 400, message: '이미지 없음' });

  const recipeData = await extractRecipeFromImage(imageFile.data, imageFile.type || 'image/jpeg');
  return { success: true, data: recipeData };
});
