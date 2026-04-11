<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center px-4">
    <div class="mb-8 text-center">
      <NuxtLink to="/" class="text-3xl font-black text-primary-500">FridgeDive 🍳</NuxtLink>
      <p class="text-gray-500 mt-2">나만의 스마트한 레시피 저장소</p>
    </div>

    <UCard class="w-full max-w-md shadow-xl">
      <AuthTabs />
    </UCard>

    <UButton
      to="/"
      variant="ghost"
      color="gray"
      icon="i-heroicons-arrow-left"
      class="mt-6"
    >
      홈으로 돌아가기
    </UButton>
  </div>
</template>

<script setup>
import AuthTabs from "~/app/components/AuthTabs.vue";

const userStore = useUserStore();

watchEffect(() => {
  if (userStore.user) {
    navigateTo('/');
  }
});
</script>
