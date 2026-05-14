<template>
  <div class="space-y-3">
    <div v-if="pending" class="py-10 text-center text-gray-400">
      친구 목록을 불러오는 중...
    </div>

    <div v-else-if="!userStore.user">
      <UCard class="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed">
        <div class="flex flex-col items-center">
          <UIcon name="i-heroicons-lock-closed" class="w-12 h-12 text-gray-300 mb-4" />
          <p class="text-gray-600 font-bold text-lg">로그인이 필요한 서비스입니다.</p>
          <p class="text-gray-400 mt-1 mb-6">로그인하시면 나만의 요리 레시피를 관리하고<br/>친구들의 맛있는 비법을 구경할 수 있어요!</p>
          <UButton to="/login" color="primary" class="rounded-full px-8">로그인하러 가기</UButton>
        </div>
      </UCard>
    </div>

    <div v-else-if="friends.length === 0" class="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
      <UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-300 mb-2" />
      <p class="text-gray-500 font-medium">아직 서로 팔로우한 친구가 없어요.</p>
    </div>

    <div v-else class="grid gap-3">
      <UCard
        v-for="friend in friends"
        :key="friend.id"
        :ui="{ body: { padding: 'p-4 sm:p-5' } }"
        class="hover:shadow-md transition-all cursor-pointer border border-gray-100 active:scale-[0.98]"
        @click="navigateTo(`/users/${friend.id}`)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold text-gray-900 text-lg truncate">{{ friend.nickname }}</span>
              <UBadge color="primary" variant="soft" size="xs" class="flex-shrink-0 font-bold">친구</UBadge>
            </div>

            <p class="text-sm text-gray-500 truncate">
              <template v-if="friend.lastRecipe">
                <span class="text-primary-600 font-semibold">'{{ friend.lastRecipe }}'</span>
                <span class="text-gray-400 ml-1">를 요리했어요!</span>
              </template>
              <span v-else class="text-gray-400 italic">아직 요리 활동이 없어요.</span>
            </p>
          </div>

          <UIcon
            name="i-heroicons-chevron-right-20-solid"
            class="w-6 h-6 text-gray-400 flex-shrink-0 ml-4"
          />
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
import {useUserStore} from "~/stores/user.js";

const userStore = useUserStore

const friends = ref([]);
const pending = ref(true);

onMounted(async () => {
  try {

    if (!userStore.user) {
      return;
    }

    const data = await $fetch('/api/follows/list');
    friends.value = data || [];
  } catch (err) {
    console.error('친구 목록 로드 실패:', err);
  } finally {
    pending.value = false;
  }
});
</script>
