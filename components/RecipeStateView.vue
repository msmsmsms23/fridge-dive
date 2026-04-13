<template>
  <div v-if="pending" class="flex flex-col items-center justify-center py-20 gap-4">
    <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-primary-500" />
    <p class="text-gray-500 animate-pulse">레시피를 불러오는 중입니다...</p>
  </div>

  <div v-else class="text-center py-20 space-y-4">
    <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-gray-300" />
    <p class="text-xl font-medium text-gray-500">레시피를 찾을 수 없어요.</p>
    <UButton to="/" variant="outline" icon="i-heroicons-home">홈으로 돌아가기</UButton>
  </div>
</template>

<script setup>
const props = defineProps({
  pending: Boolean
})
</script>
