<template>
  <UContainer class="py-10 max-w-xl">
    <div class="flex justify-between items-center w-full mb-8">
      <UButton
        variant="ghost"
        color="gray"
        icon="i-heroicons-arrow-left"
        @click="$router.back()"
      >뒤로 가기</UButton>
    </div>

    <div v-if="log" class="space-y-10">
      <div class="space-y-6">
        <div class="space-y-3">
          <div class="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-bold tracking-wider uppercase">
            {{ formatDate(log.createdAt) }}요일
          </div>

          <h1 class="text-3xl sm:text-4xl font-black text-gray-900 leading-[1.2]">
            <span class="text-primary-500">{{ log.recipe?.title || '' }}</span>
            <br v-if="log.recipe?.title?.length > 10" class="sm:hidden">
            만든 날
          </h1>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink :to="`/users/${log.user.id}`" class="flex items-center gap-2 group">
            <UAvatar size="xs" :alt="log.user.nickname" />
            <span class="text-sm font-bold text-gray-700">{{ log.user.nickname }}</span>
          </NuxtLink>

          <FollowButton :target-user-id="log.user.id" />
        </div>
      </div>

      <div v-if="log.finishedImageUrl" class="rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5">
        <img :src="log.finishedImageUrl" class="w-full h-auto" alt="완성된 요리 사진" />
      </div>

      <div class="relative group">
        <div class="absolute -top-3 -left-3">
          <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="w-8 h-8 text-primary-100" />
        </div>
        <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm min-h-[150px] relative overflow-hidden">
          <div class="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none">
            <UIcon name="i-heroicons-chat-bubble-oval-left-ellipsis" class="w-32 h-32" />
          </div>
          <p class="text-gray-700 leading-relaxed whitespace-pre-wrap relative z-10 text-lg font-medium italic">
            "{{ log.memo || '남겨진 기록이 없습니다.' }}"
          </p>
        </div>
      </div>

      <div class="border-t border-b border-gray-50 py-2">
        <ReactionButtons
          :log-id="log.id"
          :owner-id="log.user.id"
          :reactions="log.reactions || []"
          @refresh="refresh"
        />
      </div>
    </div>

    <div v-if="log && userStore.user?.id === log.user.id" class="flex justify-center pt-10">
      <UButton
        color="red"
        size="xs"
        variant="ghost"
        icon="i-heroicons-trash"
        label="기록 삭제하기"
        class="opacity-40 hover:opacity-100 transition-opacity"
        @click="confirmDelete"
      />
    </div>
  </UContainer>
</template>

<script setup>
const userStore = useUserStore();
const route = useRoute();
const logId = route.params.id;

const { data: logResponse, refresh } = await useFetch(`/api/logs/${logId}`);
const log = computed(() => logResponse.value?.data);

const formatDate = (dateStr) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'
  }).format(new Date(dateStr));
};

const confirmDelete = async () => {
  if (!confirm('정말 이 요리 기록 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.')) return;

  try {
    await $fetch(`/api/logs/${logId}`, { method: 'DELETE' });
    navigateTo('/');
  } catch (e) {
    alert('삭제 실패');
  }
};
</script>
