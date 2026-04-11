<template>
  <header class="flex justify-between items-center p-4 bg-white border-b">
    <NuxtLink to="/" class="font-bold text-xl text-primary-500">FridgeDive 🍳</NuxtLink>

    <div class="flex items-center gap-4">
      <template v-if="userStore.user">
        <span class="text-sm text-gray-600">{{ userStore.user.nickname }} 님</span>
        <UButton
          color="red"
          variant="ghost"
          icon="i-heroicons-arrow-left-on-rectangle"
          @click="handleLogout"
        >
          로그아웃
        </UButton>
      </template>

      <UButton v-else to="/" color="primary">로그인</UButton>
    </div>
  </header>
</template>

<script setup>
const userStore = useUserStore();

onMounted(async () => {
  if (!userStore.user) { // 유저 정보가 없을 때만 가져오기
    console.log('헤더에서 유저 정보 요청 중...');
    await userStore.fetchCurrentUser();
  }
});

const handleLogout = async () => {
  await userStore.logout();
};
</script>
