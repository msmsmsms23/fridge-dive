<template>
  <section class="mt-20 mb-20 px-6 max-w-4xl mx-auto space-y-10">

    <div class="space-y-2 border-b border-gray-100 pb-6">
      <h3 class="text-2xl font-black text-gray-900 flex items-center gap-2">
        나의 요리 갤러리
        <span class="text-primary-500 text-sm bg-primary-50 px-2 py-0.5 rounded-full">
          {{ logs.length }}
        </span>
      </h3>
      <p class="text-sm text-gray-400">직접 만든 요리의 소중한 순간들</p>
    </div>

    <div v-if="logs.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      <div
        v-for="log in sortedLogs"
        :key="log.id"
        class="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        style="aspect-ratio: 1 / 1;"
        @click="goToLogDetail(log.id)"
      >
        <img
          v-if="log.finishedImageUrl"
          :src="log.finishedImageUrl"
          class="w-full h-full object-cover"
        />

        <div
          v-else-if="log.memo"
          class="w-full h-full p-5 flex items-center justify-center text-center bg-gray-50"
        >
          <p class="text-xs sm:text-sm font-bold leading-snug line-clamp-4 italic">
            {{ log.memo }}
          </p>
        </div>

        <div v-else class="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
          <UIcon name="i-heroicons-calendar" class="w-8 h-8 opacity-20" />
          <span class="text-[10px] font-bold mt-2 uppercase tracking-tighter">{{ formatSimpleDate(log.createdAt) }}</span>
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

    <div v-else class="py-20 text-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
      <p class="text-gray-400 font-medium">아직 요리 기록이 없어요.</p>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  logs: {
    type: Array,
    default: () => []
  }
});

const sortedLogs = computed(() => {
  return [...props.logs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const goToLogDetail = (logId) => {
  navigateTo(`/logs/${logId}`);
};

// 날짜 포맷 (심플 - 이미지/메모 없을 때)
const formatSimpleDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};
</script>
