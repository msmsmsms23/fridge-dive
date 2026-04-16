<template>
  <UContainer class="py-10 max-w-4xl"> <div class="flex flex-col items-center mb-12 bg-white rounded-3xl p-10 border border-gray-100 shadow-sm relative overflow-hidden">
    <div class="absolute top-0 inset-x-0 h-2 bg-primary-500" />

    <UAvatar
      size="3xl"
      class="ring-4 ring-white shadow-lg mb-6"
      :src="userData?.avatarUrl"
      :ui="{ rounded: 'rounded-full' }"
    >
      <span class="text-4xl">{{ getRandomEmoji(userData?.id || 1) }}</span>
    </UAvatar>

    <h2 class="text-3xl font-black text-gray-900 mb-2">{{ userData?.nickname || '사용자' }}</h2>

    <div class="flex gap-6 mb-8 text-sm">
      <div class="flex flex-col items-center">
        <span class="font-black text-gray-900">{{ userData?._count?.followers || 0 }}</span>
        <span class="text-gray-400">팔로워</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="font-black text-gray-900">{{ userData?._count?.following || 0 }}</span>
        <span class="text-gray-400">팔로잉</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="font-black text-gray-900">{{ userData?.recipes?.length || 0 }}</span>
        <span class="text-gray-400">레시피</span>
      </div>
    </div>

    <div class="flex gap-3">
      <template v-if="userStore.user?.id !== Number(userId)">
        <FollowButton
          :target-user-id="Number(userId)"
          size="lg"
          class="px-10"
          @success="refresh"
        />
      </template>

      <UButton v-else color="gray" variant="ghost" label="프로필 수정" icon="i-heroicons-cog-8-tooth" />
    </div>
  </div>

    <div class="flex gap-8 border-b border-gray-100 mb-8">
      <button
        v-for="tab in ['recipes', 'logs']"
        :key="tab"
        :class="activeTab === tab ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-400'"
        class="pb-4 px-2 border-b-2 font-bold transition-all text-lg"
        @click="activeTab = tab"
      >
        {{ tab === 'recipes' ? '공개 레시피' : '요리 피드' }}
      </button>
    </div>

    <div v-if="activeTab === 'recipes'">
      <div v-if="userData?.recipes?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="recipe in userData.recipes"
          :key="recipe.id"
          class="hover:shadow-md transition-all cursor-pointer rounded-2xl border-none ring-1 ring-gray-100"
          @click="navigateTo(`/recipes/${recipe.id}`)"
        >
          <h3 class="font-bold text-lg mb-2 text-gray-800">{{ recipe.title }}</h3>
          <p class="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {{ recipe.description || '설명이 없는 레시피입니다.' }}
          </p>
        </UCard>
      </div>
      <div v-else class="text-center py-20 text-gray-400 italic">공개된 레시피가 없어요.</div>
    </div>

    <div v-else>
      <div v-if="userData?.cookingLogs?.length" class="space-y-10">
        <div class="space-y-2 border-b border-gray-100 pb-6">
          <h3 class="text-2xl font-black text-gray-900 flex items-center gap-2">
            요리 갤러리
            <span class="text-primary-500 text-sm bg-primary-50 px-2 py-0.5 rounded-full">
              {{ userData.cookingLogs.length }}
            </span>
          </h3>
          <p class="text-sm text-gray-400">직접 만든 요리의 소중한 순간들</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div
            v-for="log in sortedLogs"
            :key="log.id"
            class="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            style="aspect-ratio: 1 / 1;"
            @click="navigateTo(`/logs/${log.id}`)"
          >
            <img
              v-if="log.finishedImageUrl"
              :src="log.finishedImageUrl"
              class="w-full h-full object-cover"
              alt="요리 사진"
            />

            <div
              v-else-if="log.memo"
              class="w-full h-full p-5 flex items-center justify-center text-center bg-gray-50"
            >
              <p class="text-xs sm:text-sm font-bold leading-snug line-clamp-4 italic text-gray-600">
                {{ log.memo }}
              </p>
            </div>

            <div v-else class="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
              <UIcon name="i-heroicons-calendar" class="w-8 h-8 opacity-20" />
              <span class="text-[10px] font-bold mt-2 uppercase tracking-tighter">
                {{ formatSimpleDate(log.createdAt) }}
              </span>
            </div>

            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div class="flex items-center gap-4 text-white font-bold text-sm">
                <div class="flex items-center gap-1">
                  <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="w-5 h-5" />
                  <span>상세보기</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="py-20 text-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
        <p class="text-gray-400 font-medium">아직 요리 기록이 없어요.</p>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
const route = useRoute();
const userId = route.params.id;
const userStore = useUserStore();
const activeTab = ref('recipes');

const { data: userResponse, refresh } = await useFetch(`/api/users/${userId}`);
const userData = computed(() => userResponse.value?.data);

const getRandomEmoji = (seed) => {
  const emojis = ['🍳', '🍕', '🍰', '🍱', '🥗', '🥘', '🍲', '🍓', '🥑', '🥨'];
  return emojis[seed % emojis.length];
};

const sortedLogs = computed(() => {
  if (!userData.value?.cookingLogs) return [];
  return [...userData.value.cookingLogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const formatSimpleDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};
</script>
