<template>
  <UContainer class="py-10">
    <div class="flex flex-col items-center mb-12 bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
      <UAvatar
        size="3xl"
        class="ring-4 ring-white shadow-lg mb-4"
        :src="userData?.nickname"
        :ui="{ rounded: 'rounded-full' }"
      >
        <span class="text-4xl">{{ getRandomEmoji(userData?.id || 1) }}</span>
      </UAvatar>

      <h2 class="text-2xl font-black text-gray-900 mb-1">{{ userData?.nickname || '사용자' }}</h2>
      <p class="text-sm text-gray-500 mb-6">{{ userData?.recipes?.length || 0 }}개의 레시피 공유 중</p>

      <div class="flex gap-4">
        <UButton
          :color="isFollowing ? 'gray' : 'primary'"
          :variant="isFollowing ? 'soft' : 'solid'"
          size="lg"
          class="rounded-full px-8 font-bold transition-all"
          :loading="followLoading"
          @click="toggleFollow"
        >
          {{ isFollowing ? '팔로잉' : '팔로우' }}
        </UButton>
        <UButton color="white" variant="soft" icon="i-heroicons-paper-airplane" class="rounded-full" />
      </div>
    </div>

    <div class="flex gap-8 border-b border-gray-100 mb-8">
      <button
        v-for="tab in ['recipes', 'logs']"
        :key="tab"
        :class="activeTab === tab ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-400'"
        class="pb-4 px-2 border-b-2 font-bold transition-all text-lg capitalize"
        @click="activeTab = tab"
      >
        {{ tab === 'recipes' ? '공개 레시피' : '요리 피드' }}
      </button>
    </div>

    <div v-if="activeTab === 'recipes'">
      <div v-if="userData?.recipes?.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UCard
          v-for="recipe in userData.recipes"
          :key="recipe.id"
          class="hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 rounded-2xl"
          @click="navigateTo(`/recipes/${recipe.id}`)"
        >
          <h3 class="font-bold text-lg mb-2 text-gray-800">{{ recipe.title }}</h3>
          <p class="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {{ recipe.description || '설명이 없는 레시피입니다.' }}
          </p>
        </UCard>
      </div>
      <div v-else class="text-center py-20 text-gray-400">공개된 레시피가 없어요.</div>
    </div>

    <div v-else>
      <div v-if="userData?.cookingLogs?.length" class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="log in userData.cookingLogs"
          :key="log.id"
          class="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer"
          @click="navigateTo(`/logs/${log.id}`)"
        >
          <img :src="log.finishedImageUrl" alt="finishedImage" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
        </div>
      </div>
      <div v-else class="text-center py-20 text-gray-400">기록된 요리 피드가 없어요.</div>
    </div>
  </UContainer>
</template>

<script setup>
const route = useRoute();
const userId = route.params.id;
const activeTab = ref('recipes');
const isFollowing = ref(false);
const followLoading = ref(false);

const { data: userResponse } = await useFetch(`/api/users/${userId}`);
const userData = computed(() => userResponse.value?.data);

const getRandomEmoji = (seed) => {
  const emojis = ['🍳', '🍕', '🍰', '🍱', '🥗', '🥘', '🍲', '🍓', '🥑', '🥨'];
  return emojis[seed % emojis.length];
};

const toggleFollow = async () => {
  followLoading.value = true;
  // TODO: 팔로우 API 호출
  setTimeout(() => {
    isFollowing.value = !isFollowing.value;
    followLoading.value = false;
  }, 500);
};
</script>
