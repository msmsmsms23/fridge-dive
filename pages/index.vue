<template>
  <div>
    <UContainer class="py-10">
      <div class="flex justify-between items-center mb-8">
        <div v-if="userStore.user">
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">
            {{ userStore.user?.nickname }} 님, 안녕하세요! 👋
          </h1>
          <p class="text-gray-500 mt-1">오늘의 요리 기록을 남겨 보세요.</p>
        </div>
        <div v-else>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">
            반가워요! 🍳
          </h1>
          <p class="text-gray-500 mt-1">오늘 FridgeDive에서 맛있는 레시피를 찾아보세요.</p>
        </div>

        <UButton v-if="userStore.user" to="/recipes/upload" icon="i-heroicons-plus-circle" size="lg" class="rounded-full shadow-lg">
          새 레시피
        </UButton>
        <UButton v-else to="/login" color="primary" variant="solid" size="lg" class="rounded-full">
          로그인하고 시작하기
        </UButton>
      </div>

      <div class="flex border-b border-gray-100 mb-8 gap-8">
        <button
          v-for="tab in [{ id: 'recipes', label: 'Recipes' }, { id: 'logs', label: 'Feed' }]"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-400'"
          class="pb-4 px-2 border-b-2 font-bold transition-all text-lg"
        >
          {{ tab.label }}
        </button>
      </div>

      <RecipeList v-if="activeTab === 'recipes'" />
      <LogFeed v-else-if="activeTab === 'logs'" />
    </UContainer>
  </div>
</template>

<script setup>
const userStore = useUserStore();
const activeTab = ref('recipes');
</script>
