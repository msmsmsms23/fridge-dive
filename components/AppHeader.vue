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
    </div>
  </header>
</template>

<script setup>
const userStore = useUserStore();

onMounted(async () => {
  if (!userStore.user) {
    await userStore.fetchCurrentUser();
  }
});

const handleLogout = async () => {
  await userStore.logout();
};
</script>
