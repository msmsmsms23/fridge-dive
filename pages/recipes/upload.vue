<template>
  <UContainer class="max-w-2xl py-10">
    <RecipeAnalyzer
      v-if="!recipeData"
      @success="recipeData = $event"
    />

    <RecipeEditor
      v-else
      v-model="recipeData"
      :loading="isSaving"
      @reset="recipeData = null"
      @save="handleSave"
    />
  </UContainer>
</template>

<script setup>
const recipeData = ref(null);
const { saveRecipe, isSaving } = useRecipe(); // 로직 불러오기

const handleSave = async () => {
  await saveRecipe(recipeData.value);
};
// 볼에 계란과 설탕을 넣고 섞어주세요
// 물이나 우유를 넣고 섞어주세요
// 박력분과 베이킹파우더를 섞어서 채쳐넣어주세요
// 섞어주세요
// 녹인버터를 넣고 섞어주세요
// 짤주머니에 담고 냉장고에서 한시간 넣어두세요
// 틀에넣고 180도로 예열된 오븐에 13분 구워주세요
</script>
