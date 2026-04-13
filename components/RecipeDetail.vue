<template>
  <div class="max-w-3xl mx-auto space-y-8 pt-10 px-4"> <div class="flex flex-col sm:flex-row justify-between sm:items-end border-b pb-6 gap-4">
    <div class="space-y-2">
      <h1 class="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">{{ recipe.title }}</h1>
      <p class="text-base sm:text-lg text-gray-500">{{ recipe.description || '맛있는 요리 시간을 가져보세요.' }}</p>
    </div>

    <div class="flex gap-2 w-full sm:w-auto">
      <UButton
        color="gray"
        variant="soft"
        icon="i-heroicons-pencil"
        class="flex-1 sm:flex-none justify-center"
        @click="$emit('edit')"
      >
        수정
      </UButton>
      <UButton
        color="primary"
        size="lg"
        icon="i-heroicons-fire"
        class="flex-[2] sm:flex-none justify-center"
        @click="$emit('start')"
      >
        요리 시작
      </UButton>
    </div>
  </div>

    <section>
      <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-shopping-cart" class="text-primary-500" /> 필수 재료
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div v-for="ing in recipe.ingredients" :key="ing.id"
             class="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white transition-colors">
          <p class="font-bold text-gray-800">{{ ing.name }}</p>
          <p class="text-sm text-gray-500">{{ ing.amount }}</p>
        </div>
      </div>
    </section>

    <section>
      <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-list-bullet" class="text-primary-500" /> 조리 과정
      </h3>
      <div class="space-y-4">
        <div v-for="step in recipe.steps" :key="step.id"
             class="flex gap-4 p-5 border rounded-2xl hover:bg-gray-50 transition-colors">
          <span class="text-primary-500 font-black text-xl italic">{{ step.stepOrder }}</span>
          <div class="space-y-1 flex-1">
            <p class="text-gray-700 leading-relaxed">{{ step.instruction }}</p>
            <div v-if="step.timerSeconds > 0" class="flex items-center gap-1 text-xs text-primary-500 font-medium">
              <UIcon name="i-heroicons-clock" />
              {{ Math.floor(step.timerSeconds / 60) }}분 {{ step.timerSeconds % 60 }}초 타이머
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const props = defineProps({
  recipe: Object
})
const emit = defineEmits(['edit', 'start'])
</script>
