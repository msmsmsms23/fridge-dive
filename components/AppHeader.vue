<template>
  <header class="flex justify-between items-center p-4 bg-white border-b">
    <NuxtLink to="/" class="font-bold text-xl text-primary-500">FridgeDive 🍳</NuxtLink>
    <div v-if="userStore.user" class="flex items-center gap-4">
      <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
        <UButton
          color="white"
          trailing-icon="i-heroicons-chevron-down-20-solid"
        >
          <UIcon name="i-heroicons-at-symbol" class="w-4 h-4 text-gray-500" />
          {{ userStore.user?.nickname }}
        </UButton>
      </UDropdown>
    </div>

    <div v-else class="flex items-center gap-2">
      <UButton
        color="white"
        variant="soft"
        to="/login"
      >
        로그인
      </UButton>
      <UButton
        color="primary"
        variant="soft"
        :to="{ path: '/login', query: { tab: '1' } }"
      >
        회원가입
      </UButton>
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

const items = computed(() => [
  [
    {
      label: '프로필',
      icon: 'i-heroicons-user',
      to: `/users/${userStore.user?.id}`
    }
  ],
  [
    {
      label: '설정',
      icon: 'i-heroicons-wrench-screwdriver',
      to: "/users/setting"
    },
    {
      label: '로그아웃',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: () => {
        handleLogout()
      }
    }
  ]
]);
</script>
