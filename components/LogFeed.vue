<template>
  <div>
    <div class="flex gap-2 mb-6">
      <UButton
        v-for="filter in feedFilters"
        :key="filter.value"
        :color="currentFilter === filter.value ? 'primary' : 'gray'"
        :variant="currentFilter === filter.value ? 'solid' : 'ghost'"
        class="rounded-full px-4 font-bold"
        @click="currentFilter = filter.value"
      >
        {{ filter.label }}
      </UButton>
    </div>

    <template v-if="currentFilter !== 'all' && !userStore.user">
      <UCard class="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed">
        <div class="flex flex-col items-center">
          <UIcon name="i-heroicons-lock-closed" class="w-12 h-12 text-gray-300 mb-4" />
          <p class="text-gray-600 font-bold text-lg">로그인이 필요한 서비스입니다.</p>
          <p class="text-gray-400 mt-1 mb-6">로그인하시면 나만의 요리 기록을 관리하고<br/>친구들의 소식을 받아볼 수 있어요!</p>
          <UButton to="/login" color="primary" class="rounded-full px-8">로그인하러 가기</UButton>
        </div>
      </UCard>
    </template>

    <template v-else>
      <div v-if="hasLogs" class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div
          v-for="log in logsList"
          :key="log.id"
          style="aspect-ratio: 1 / 1;"
          class="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          @click="navigateTo(`/logs/${log.id}`)"
        >
          <div class="aspect-square bg-gray-100 overflow-hidden relative">
            <img v-if="log.finishedImageUrl" alt="finishedImage" :src="log.finishedImageUrl" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div class="p-5 space-y-3 flex flex-col h-full">
            <div class="absolute top-4 left-4">
              <span class="text-[10px] text-primary-600 font-bold mb-1 pl-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
                @{{ log.user?.nickname }}
              </span>
            </div>
            <div class="flex items-center pt-5 gap-2">
              <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="text-primary-500 w-4 h-4 flex-shrink-0" />
              <h4 class="font-bold text-gray-900 truncate">{{ log.recipe?.title || '' }}</h4>
            </div>
            <p class="text-sm text-gray-600 line-clamp-2 leading-relaxed h-[40px] flex-grow">
              {{ log.memo || '' }}
            </p>
            <div class="flex justify-end mt-auto">
              <span class="bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full font-bold">
                {{ formatDate(log.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <UCard v-else class="text-center py-20 bg-gray-50/50 rounded-3xl">
        <div v-if="currentFilter === 'following'" class="flex flex-col items-center">
          <UIcon name="i-heroicons-users" class="w-12 h-12 text-gray-300 mb-4" />
          <p class="text-gray-500 font-medium">아직 팔로잉하고 있는 친구가 없어요.</p>
        </div>
        <div v-else class="flex flex-col items-center">
          <UIcon name="i-heroicons-camera" class="w-12 h-12 text-gray-300 mb-4" />
          <p class="text-gray-500 font-medium">아직 완성된 요리 기록이 없어요.</p>
        </div>
      </UCard>
    </template>
  </div>
</template>
<script setup>
const userStore = useUserStore();
const currentFilter = ref(userStore.user ? 'mine' : 'all');

const feedFilters = [
  { label: '내 기록', value: 'mine' },
  { label: '팔로잉', value: 'following' },
  { label: '전체 탐색', value: 'all' },
];

const { data: logsResponse } = await useFetch('/api/logs', {
  query: { type: currentFilter },
  watch: [currentFilter]
});

const logsList = computed(() => logsResponse.value?.data || []);
const hasLogs = computed(() => logsList.value.length > 0);

const formatDate = (dateStr) => new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric' }).format(new Date(dateStr));
</script>
