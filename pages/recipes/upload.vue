<template>
  <UContainer class="max-w-2xl py-10">
    <div v-if="!recipeData" class="space-y-6">
      <RecipeAnalyzer @success="recipeData = $event" />

      <div class="relative">
        <UDivider label="OR" />
      </div>

      <UButton
        block
        color="white"
        variant="soft"
        icon="i-heroicons-pencil-square"
        @click="startManualInput"
      >
        직접 레시피 작성하기
      </UButton>
    </div>

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
const { saveRecipe, isSaving } = useRecipe();

const startManualInput = () => {
  recipeData.value = {
    title: '',
    description: '',
    isPublic: 'private',
    ingredients: [{ name: '', amount: '' }],
    steps: [{
      stepOrder: 1,
      instruction: '',
      timerSeconds: 0
    }]
  };
};

const handleSave = async () => {
  await saveRecipe(recipeData.value);
};
</script>
