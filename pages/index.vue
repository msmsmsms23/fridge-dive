<template>
  <div>
    <template v-if="userStore.user">
      <UContainer class="py-10">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ userStore.user.nickname }} 님의 레시피 박스 📦
            </h1>
            <p class="text-sm text-gray-500 mt-1">오늘도 맛있는 요리 준비되셨나요?</p>
          </div>
          <UButton to="/recipes/upload" icon="i-heroicons-plus-circle" size="lg">
            새 레시피 등록
          </UButton>
        </div>

        <div v-if="hasRecipes" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UCard
            v-for="recipe in recipesList"
            :key="recipe.id"
            class="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
            @click="goToDetail(recipe.id)"
          >
            <template #header>
              <div class="flex justify-between items-start">
                <h3 class="font-bold text-lg truncate flex-1">{{ recipe.title }}</h3>
                <UIcon name="i-heroicons-chevron-right" class="text-gray-400" />
              </div>
            </template>

            <p class="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
              {{ recipe.description || '설명이 없는 레시피입니다.' }}
            </p>

            <template #footer>
              <div class="flex justify-between items-center">
        <span class="text-xs text-gray-400">
          {{ new Date(recipe.createdAt).toLocaleDateString() }}
        </span>
                <UBadge color="primary" variant="soft" size="xs">
                  {{ recipe.cookingLogs?.length || 0 }}개의 기록
                </UBadge>
              </div>
            </template>
          </UCard>
        </div>

        <UCard v-else class="text-center py-20 bg-gray-50/50 border-dashed border-2">
          <div class="flex flex-col items-center">
            <UIcon name="i-heroicons-document-plus" class="w-12 h-12 text-gray-300 mb-4" />
            <p class="text-gray-500 mb-6">아직 등록된 레시피가 없네요!</p>
            <UButton to="/recipes/upload" variant="outline">첫 레시피 만들기</UButton>
          </div>
        </UCard>
      </UContainer>
    </template>

    <template v-else>
      <div class="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-black text-gray-900 mb-4">냉장고 파먹기의 종결자 🍳</h1>
          <p class="text-lg text-gray-600 font-medium">AI가 알려 주는 나만의 맞춤형 레시피 저장소, FridgeDive</p>
        </div>

        <UCard class="w-full max-w-md shadow-2xl">
          <AuthTabs />
        </UCard>
      </div>
    </template>
  </div>
</template>

<script setup>
import AuthTabs from "~/app/components/AuthTabs.vue";

const userStore = useUserStore();

const recipesList = computed(() => recipeResponse.value?.data || []);
const hasRecipes = computed(() => recipesList.value.length > 0);

const { data: recipeResponse, refresh } = await useFetch('/api/recipes', {
  immediate: !!userStore.user,
  watch: [() => userStore.user]
});

const goToDetail = (id) => {
  navigateTo(`/recipes/${id}`);
};

onMounted(() => {
  if (userStore.user) refresh();
});
</script>

지금 이거야
