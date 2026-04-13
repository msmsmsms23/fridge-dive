<template>
  <UContainer class="py-10 max-w-xl">
    <UButton
      variant="ghost"
      color="gray"
      icon="i-heroicons-arrow-left"
      class="mb-6"
      @click="$router.back()"
    >뒤로 가기</UButton>

    <div v-if="log" class="space-y-8">
      <div class="space-y-4">
        <div class="space-y-2 pb-4">
          <p class="text-primary-600 font-bold text-sm tracking-tight">
            {{ formatDate(log.createdAt) }}요일
          </p>
          <h1 class="text-3xl font-black text-gray-900 leading-tight">
            <span class="text-primary-500">{{ log.recipe?.title || '' }}</span>을 만든 기록
          </h1>
        </div>

        <div v-if="log.finishedImageUrl" class="rounded-3xl overflow-hidden shadow-xl">
          <img :src="log.finishedImageUrl" class="w-full h-auto" alt="완성된 요리 사진" />
        </div>

        <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100 min-h-[150px] relative">
          <p class="text-gray-700 leading-relaxed whitespace-pre-wrap relative z-10">
            {{ log.memo || '남겨진 메모가 없습니다.' }}
          </p>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
const route = useRoute();
const logId = route.params.id;

// 로그 정보를 가져오는 API 호출
const { data: logResponse } = await useFetch(`/api/logs/${logId}`);
const log = computed(() => logResponse.value?.data);

const formatDate = (dateStr) => {
  // 요일만 따로 뽑지 않고 전체 날짜 포맷 유지
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'
  }).format(new Date(dateStr));
};
</script>
