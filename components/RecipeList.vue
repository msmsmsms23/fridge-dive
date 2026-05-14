<template>
  <div class="">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div class="flex gap-2">
        <UButton
          v-for="filter in recipeFilters"
          :key="filter.value"
          :color="currentFilter === filter.value ? 'primary' : 'gray'"
          :variant="currentFilter === filter.value ? 'solid' : 'ghost'"
          class="rounded-full px-4 font-bold"
          @click="currentFilter = filter.value"
        >
          {{ filter.label }}
        </UButton>
      </div>

      <div class="w-full md:w-64">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          size="md"
          variant="outline"
          placeholder="레시피 제목, 재료 검색..."
          class="rounded-xl shadow-sm"
          :ui="{ rounded: 'rounded-xl' }"
          trailing
        >
          <template #trailing>
            <UButton
              v-if="searchQuery"
              color="gray"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click="searchQuery = ''"
            />
          </template>
        </UInput>
      </div>
    </div>

    <template v-if="currentFilter !== 'all' && !userStore.user">
      <UCard class="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed">
        <div class="flex flex-col items-center">
          <UIcon name="i-heroicons-lock-closed" class="w-12 h-12 text-gray-300 mb-4" />
          <p class="text-gray-600 font-bold text-lg">로그인이 필요한 서비스입니다.</p>
          <p class="text-gray-400 mt-1 mb-6">로그인하시면 나만의 요리 레시피를 관리하고<br/>친구들의 맛있는 비법을 구경할 수 있어요!</p>
          <UButton to="/login" color="primary" class="rounded-full px-8">로그인하러 가기</UButton>
        </div>
      </UCard>
    </template>

    <template v-else>
      <div v-if="hasRecipes" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UCard
          v-for="recipe in recipesList"
          :key="recipe.id"
          class="hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 rounded-2xl relative"
          @click="navigateTo(`/recipes/${recipe.id}`)"
        >
          <template #header>
            <div class="flex justify-between items-start">
              <div class="flex flex-col gap-1">
                <div v-if="userStore.user && recipe.userId === userStore.user.id" class="flex items-center gap-1 mb-1">
                  <UBadge
                    :color="recipe.isPublic === 'public' ? 'primary' : 'gray'"
                    variant="soft"
                    size="xs"
                  >
                    {{ recipe.isPublic === 'public' ? '전체 공개' : (recipe.isPublic === 'friends' ? '친구 공개' : '나만 보기')}}
                  </UBadge>
                </div>
                <div v-else class="text-[10px] text-primary-600 font-bold mb-1">
                  @{{ recipe.user?.nickname || '요리사 누군가' }}
                </div>
                <h3 class="font-bold text-lg truncate flex-1 text-gray-800">{{ recipe.title }}</h3>
              </div>
              <UIcon name="i-heroicons-chevron-right" class="text-gray-300" />
            </div>
          </template>

          <p class="text-sm text-gray-500 line-clamp-2 min-h-[40px] leading-relaxed">
            {{ recipe.description || '설명이 없는 레시피입니다.' }}
          </p>

          <template #footer>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-400 font-medium">{{ formatDate(recipe.createdAt) }}</span>
              <UBadge color="primary" variant="subtle" size="xs" class="rounded-full px-2">
                {{ recipe.cookingLogs?.length || 0 }} Logs
              </UBadge>
            </div>
          </template>
        </UCard>
      </div>

      <UCard v-else class="text-center py-20 bg-gray-50/50 border-dashed border-2 rounded-3xl">
        <div v-if="currentFilter === 'following'" class="flex flex-col items-center">
          <UIcon name="i-heroicons-users" class="w-12 h-12 text-gray-300 mb-4" />
          <p class="text-gray-500 font-medium">아직 팔로잉하고 있는 친구가 없어요.</p>
          <p class="text-sm text-gray-400 mt-1">커뮤니티를 탐색하고 같이 요리할 친구를 찾아보세요!</p>
        </div>
        <div v-else class="flex flex-col items-center">
          <UIcon name="i-heroicons-document-plus" class="w-12 h-12 text-gray-300 mb-4" />
          <p class="text-gray-500 font-medium">아직 등록된 레시피가 없어요.</p>
          <UButton v-if="userStore.user" to="/recipes/upload" variant="outline" class="rounded-full px-6 mt-4">
            첫 레시피 만들기
          </UButton>
        </div>
      </UCard>
    </template>
  </div>
</template>

<script setup>
  const userStore = useUserStore();
  const currentFilter = ref(userStore.user ? 'mine' : 'all');
  const searchQuery = ref('');

  const apiPath = computed(() =>
  searchQuery.value.trim() ? '/api/recipes/search' : '/api/recipes'
  );

  const { data: recipeResponse, refresh } = await useFetch(apiPath, {
  query: {
  type: currentFilter,
  keyword: searchQuery
},
  watch: [apiPath, currentFilter, searchQuery]
});

  const recipesList = computed(() => recipeResponse.value?.data || []);
  const hasRecipes = computed(() => recipesList.value.length > 0);

  const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString();
};
</script>
