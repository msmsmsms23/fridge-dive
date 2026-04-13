<template>
  <div>
    <template v-if="userStore.user">
      <UContainer class="py-10">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">
              {{ userStore.user.nickname }} 님, 안녕하세요! 👋
            </h1>
            <p class="text-gray-500 mt-1">오늘의 요리 기록을 남겨 보세요.</p>
          </div>
          <UButton to="/recipes/upload" icon="i-heroicons-plus-circle" size="lg" class="rounded-full shadow-lg">
            새 레시피
          </UButton>
        </div>

        <div class="flex border-b border-gray-100 mb-8 gap-8">
          <button
            @click="activeTab = 'recipes'"
            :class="activeTab === 'recipes' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-400'"
            class="pb-4 px-2 border-b-2 font-bold transition-all text-lg"
          >
            내 레시피
          </button>
          <button
            @click="activeTab = 'logs'"
            :class="activeTab === 'logs' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-400'"
            class="pb-4 px-2 border-b-2 font-bold transition-all text-lg"
          >
            요리 피드
          </button>
        </div>

        <div v-if="activeTab === 'recipes'">
          <div v-if="hasRecipes" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UCard
              v-for="recipe in recipesList"
              :key="recipe.id"
              class="hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 rounded-2xl"
              @click="goToDetail(recipe.id)"
            >
              <template #header>
                <div class="flex justify-between items-start">
                  <h3 class="font-bold text-lg truncate flex-1 text-gray-800">{{ recipe.title }}</h3>
                  <UIcon name="i-heroicons-chevron-right" class="text-gray-300" />
                </div>
              </template>
              <p class="text-sm text-gray-500 line-clamp-2 min-h-[40px] leading-relaxed">
                {{ recipe.description || '설명이 없는 레시피입니다.' }}
              </p>
              <template #footer>
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-400 font-medium">{{ new Date(recipe.createdAt).toLocaleDateString() }}</span>
                  <UBadge color="primary" variant="subtle" size="xs" class="rounded-full px-2">
                    {{ recipe.cookingLogs?.length || 0 }} Logs
                  </UBadge>
                </div>
              </template>
            </UCard>
          </div>
          <UCard v-else class="text-center py-20 bg-gray-50/50 border-dashed border-2 rounded-3xl">
            <div class="flex flex-col items-center">
              <UIcon name="i-heroicons-document-plus" class="w-12 h-12 text-gray-300 mb-4" />
              <p class="text-gray-500 mb-6 font-medium">아직 등록된 레시피가 없네요!</p>
              <UButton to="/recipes/upload" variant="outline" class="rounded-full px-6">첫 레시피 만들기</UButton>
            </div>
          </UCard>
        </div>

        <div v-else-if="activeTab === 'logs'">
          <div v-if="hasLogs" class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div
              v-for="log in logsList"
              :key="log.id"
              style="aspect-ratio: 1 / 1;"
              class="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              @click="goToLogDetail(log.id)"
            >
              <div class="aspect-square bg-gray-100 overflow-hidden relative">
                <img
                  v-if="log.finishedImageUrl"
                  :src="log.finishedImageUrl"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2" />
              </div>

              <div class="p-5 space-y-3">
                <div class="absolute top-4 left-4">
                  <span class="bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full font-bold">
                    {{ formatDate(log.createdAt) }}
                  </span>
                </div>
                <div class="flex items-center pt-6 gap-2">
                  <UIcon name="i-heroicons-hand-thumb-up" class="text-primary-500 w-4 h-4" />
                  <h4 class="font-bold text-gray-900 truncate">{{ log.recipe?.title || '' }}</h4>
                </div>
                <p class="text-sm text-gray-600 line-clamp-2 leading-relaxed h-[40px]">
                  {{ log.memo || '' }}
                </p>
              </div>
            </div>
          </div>
          <UCard v-else class="text-center py-20 bg-gray-50/50 rounded-3xl">
            <div class="flex flex-col items-center">
              <UIcon name="i-heroicons-camera" class="w-12 h-12 text-gray-300 mb-4" />
              <p class="text-gray-500 font-medium">아직 완성된 요리 기록이 없어요.</p>
              <p class="text-sm text-gray-400 mt-1">요리를 완료하고 첫 사진을 남겨보세요!</p>
            </div>
          </UCard>
        </div>
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
import AuthTabs from "~/components/AuthTabs.vue";

const userStore = useUserStore();
const activeTab = ref('recipes'); // 현재 활성화된 탭 ('recipes' | 'logs')

// 1. 레시피 데이터 가져오기
const { data: recipeResponse, refresh: refreshRecipes } = await useFetch('/api/recipes', {
  immediate: !!userStore.user,
  watch: [() => userStore.user]
});
const recipesList = computed(() => recipeResponse.value?.data || []);
const hasRecipes = computed(() => recipesList.value.length > 0);

// 2. 전체 요리 기록(Logs) 데이터 가져오기
// (API가 모든 로그를 가져오도록 되어있어야 합니다. 예: /api/logs)
const { data: logsResponse, refresh: refreshLogs } = await useFetch('/api/logs', {
  immediate: !!userStore.user,
  watch: [() => userStore.user]
});
const logsList = computed(() => logsResponse.value?.data || []);
const hasLogs = computed(() => logsList.value.length > 0);

const goToDetail = (id) => navigateTo(`/recipes/${id}`);
const goToLogDetail = (id) => navigateTo(`/logs/${id}`); // 로그 상세 페이지 경로

const formatDate = (dateStr) => {
  return new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric' }).format(new Date(dateStr));
};

onMounted(() => {
  if (userStore.user) {
    refreshRecipes();
    refreshLogs();
  }
});
</script>
