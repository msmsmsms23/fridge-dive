<template>
  <div class="max-w-2xl mx-auto pb-32">

    <div class="pt-10 text-center">
      <div class="flex justify-start mb-6">
        <UButton variant="ghost" color="gray" icon="i-heroicons-chevron-left" @click="$emit('back')">
          레시피로 돌아가기
        </UButton>
      </div>

      <UBadge size="lg" variant="subtle" class="px-4 py-1 rounded-full mb-4">
        {{ currentStepIndex === -1 ? `Step 0 / ${recipe.steps.length}` : `Step ${currentStepIndex + 1} / ${recipe.steps.length}` }}
      </UBadge>

      <!-- 준비 단계 -->
      <div v-if="currentStepIndex === -1" class="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <h2 class="text-4xl font-black text-gray-900 leading-tight">모든 재료가<br/>준비되었나요? 🧺</h2>
        <div class="grid grid-cols-2 gap-3 text-left max-w-sm mx-auto">
          <UCheckbox v-for="ing in recipe.ingredients" :key="ing.id"
                     :label="`${ing.name} (${ing.amount})`" color="primary" />
        </div>
      </div>

      <!-- 조리 단계 -->
      <div v-else class="space-y-12 animate-in fade-in zoom-in-95 duration-300">
        <h2 class="text-3xl font-bold text-gray-800 leading-snug break-keep px-4 mb-6">
          {{ currentStep.instruction }}
        </h2>

        <div v-if="currentStep.timerSeconds > 0" class="relative max-w-sm mx-auto">
          <div class="relative bg-white p-10 rounded-xl border border-primary-100 shadow-xl shadow-primary-100/20 space-y-8">
            <div class="flex items-center justify-center gap-2 text-primary-500 font-bold uppercase tracking-widest text-xs">
              <UIcon name="i-heroicons-clock" class="w-4 h-4 animate-pulse" v-if="isTimerRunning" />
              <UIcon name="i-heroicons-clock" class="w-4 h-4" v-else />
              <span>Cooking Timer</span>
            </div>
            <div class="text-7xl font-mono font-black text-gray-900 tracking-tighter tabular-nums py-2">
              {{ formatTime(timeLeft) }}
            </div>
            <div class="flex justify-center items-center gap-6">
              <UButton
                icon="i-heroicons-arrow-path"
                color="gray"
                variant="soft"
                size="lg"
                class="rounded-full hover:rotate-180 transition-transform duration-500"
                @click="$emit('resetTimer')"
              />
              <UButton
                :icon="isTimerRunning ? 'i-heroicons-pause-circle' : 'i-heroicons-play-circle'"
                :color="isTimerRunning ? 'gray' : 'primary'"
                size="xl"
                class="rounded-full w-20 h-20 flex items-center justify-center shadow-lg transform transition-all active:scale-95"
                :class="isTimerRunning ? 'shadow-gray-200' : 'shadow-primary-200'"
                @click="$emit('toggleTimer')"
              >
                <template #leading>
                  <UIcon :name="isTimerRunning ? 'i-heroicons-pause-circle' : 'i-heroicons-play-circle'" class="w-10 h-10" />
                </template>
              </UButton>
              <div class="w-11"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 네비게이션 고정 -->
    <div class="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-t border-gray-100">
      <div class="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
        <UButton variant="ghost" color="gray" icon="i-heroicons-chevron-left"
                 size="xl" :disabled="currentStepIndex === -1" @click="$emit('prev')">
          이전
        </UButton>

        <div class="flex gap-2">
          <div v-for="i in (recipe.steps.length + 1)" :key="i"
               class="w-2.5 h-2.5 rounded-full transition-all duration-300"
               :class="i - 2 === currentStepIndex ? 'bg-primary-500 w-6' : 'bg-gray-200'" />
        </div>

        <UButton v-if="!isLastStep" color="primary" size="xl"
                 trailing-icon="i-heroicons-chevron-right" class="px-8" @click="$emit('next')">
          다음
        </UButton>
        <UButton v-else color="primary" size="xl" icon="i-heroicons-check-badge"
                 class="px-8 shadow-lg shadow-green-100" @click="$emit('finish')">
          요리 완료!
        </UButton>
      </div>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  recipe: Object,
  currentStepIndex: Number,
  currentStep: Object,
  isLastStep: Boolean,
  isTimerRunning: Boolean,
  timeLeft: Number,
  formatTime: Function,
  resetTimer: Function
})
const emit = defineEmits(['prev', 'next', 'finish', 'toggleTimer', 'resetTimer', 'back'])
</script>
