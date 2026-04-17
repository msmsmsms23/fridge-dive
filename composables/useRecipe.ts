export const useRecipe = () => {
  const isSaving = ref(false);

  const saveRecipe = async (recipeData: any) => {
    if (!recipeData) return;

    isSaving.value = true;

    try {
      const response = await $fetch('/api/recipes', {
        method: 'POST',
        body: { recipeData }
      });

      const rId = response?.recipeId

      alert('나만의 레시피 박스에 저장되었습니다! 🍳');
      navigateTo(`/recipes/${rId}`);
    } catch (err: any) {
      alert('저장 실패: ' + err.message);
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  return {
    saveRecipe,
    isSaving
  };
};
