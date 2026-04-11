export const useRecipe = () => {
  const isSaving = ref(false);

  const saveRecipe = async (recipeData: any) => {
    if (!recipeData) return;

    isSaving.value = true;

    try {
      await $fetch('/api/recipes', {
        method: 'POST',
        body: { recipeData } // 서버 규격에 맞춰 감싸서 보냄
      });
      alert('나만의 레시피 박스에 저장되었습니다! 🍳');
      navigateTo('/');
    } catch (err: any) {
      alert('저장 실패: ' + err);
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
